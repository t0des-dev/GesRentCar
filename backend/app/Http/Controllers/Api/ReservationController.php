<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\Client;
use App\Services\NotificationService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
        protected PricingService $pricing,
    ) {}

    // ─── Liste paginée (admin) ─────────────────────────────────────────────────
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 25);
        $perPage = min($perPage, 100); // sécurité : max 100 par page

        $reservations = Reservation::with([
                'client:id,name,email,phone,cin,cin_image_url,license_image_url',
                'vehicle:id,brand,model,plate,image_url',
                'contract:id,reservation_id,file_path,signed_at',
            ])
            ->latest('id')
            ->paginate($perPage);

        return response()->json($reservations);
    }

    // ─── Réservations de l'utilisateur connecté ────────────────────────────────
    public function my(Request $request)
    {
        $user = $request->user();
        $reservations = Reservation::whereHas('client', function ($q) use ($user) {
                $q->where('email', $user->email);
            })
            ->with([
                'vehicle:id,brand,model,plate,image_url',
                'client:id,name,email,phone',
            ])
            ->latest('id')
            ->get();

        return response()->json($reservations);
    }

    // ─── Création (admin/agent authentifié) ────────────────────────────────────
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'  => 'required|exists:clients,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'options'    => 'nullable|array',
        ]);

        $options    = $validated['options'] ?? [];
        $startDate  = \Carbon\Carbon::parse($validated['start_date']);
        $endDate    = \Carbon\Carbon::parse($validated['end_date']);
        $days       = max(1, $startDate->diffInDays($endDate));

        $reservation = DB::transaction(function () use ($validated, $options, $startDate, $endDate, $days) {
            // ✅ Verrou pessimiste : empêche la double réservation concurrente
            $vehicle = Vehicle::lockForUpdate()->findOrFail($validated['vehicle_id']);

            if (! $vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
                abort(422, 'Le véhicule n\'est pas disponible pour ces dates.');
            }

            $pricing = $this->pricing->calculateTotal($vehicle, $days, $options, null, $startDate);
            $status  = $vehicle->type === 'collaborator' ? 'pending_partner' : 'confirmed';

            return Reservation::create([
                'client_id'   => $validated['client_id'],
                'vehicle_id'  => $vehicle->id,
                'start_date'  => $validated['start_date'],
                'end_date'    => $validated['end_date'],
                'total_price' => $pricing['total_price'],
                'status'      => $status,
                'options'     => empty($options) ? null : $options,
            ]);
        });

        if ($reservation->status === 'confirmed') {
            $this->notificationService->notifyReservationConfirmed(
                $reservation->load(['client', 'vehicle'])
            );
        }

        return response()->json($reservation, 201);
    }

    // ─── Création publique (storefront client) ─────────────────────────────────
    public function publicStore(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id'               => 'required|exists:vehicles,id',
            'start_date'               => 'required|date',
            'end_date'                 => 'required|date|after:start_date',
            'client.name'              => 'required|string',
            'client.email'             => 'required|email',
            'client.phone'             => 'required|string',
            'client.cin'               => 'required|string',
            'client.license_number'    => 'nullable|string',
            'client.cin_image_url'     => 'nullable|string',
            'client.license_image_url' => 'nullable|string',
            'payment_method'           => 'required|string|in:cash,cmi,transfer,stripe,on_site',
            'signature'                => 'nullable|string',
            'options'                  => 'nullable|array',
        ]);

        $clientData = $validated['client'];
        $options    = $validated['options'] ?? [];
        $startDate  = \Carbon\Carbon::parse($validated['start_date']);
        $endDate    = \Carbon\Carbon::parse($validated['end_date']);
        $days       = max(1, $startDate->diffInDays($endDate));

        $reservation = DB::transaction(function () use ($validated, $clientData, $options, $startDate, $endDate, $days) {
            // ✅ Verrou pessimiste
            $vehicle = Vehicle::lockForUpdate()->findOrFail($validated['vehicle_id']);

            if (! $vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
                abort(422, 'Le véhicule n\'est pas disponible pour ces dates.');
            }

            $client = Client::firstOrCreate(
                ['email' => $clientData['email']],
                [
                    'name'              => $clientData['name'],
                    'phone'             => $clientData['phone'],
                    'cin'               => $clientData['cin'],
                    'license_number'    => $clientData['license_number'] ?? null,
                    'cin_image_url'     => $clientData['cin_image_url'] ?? null,
                    'license_image_url' => $clientData['license_image_url'] ?? null,
                ]
            );

            $pricing = $this->pricing->calculateTotal($vehicle, $days, $options, null, $startDate);
            $status  = $vehicle->type === 'collaborator' ? 'pending_partner' : 'confirmed';

            $res = Reservation::create([
                'client_id'      => $client->id,
                'vehicle_id'     => $vehicle->id,
                'start_date'     => $validated['start_date'],
                'end_date'       => $validated['end_date'],
                'total_price'    => $pricing['total_price'],
                'status'         => $status,
                'payment_method' => $validated['payment_method'],
                'options'        => empty($options) ? null : $options,
            ]);

            if (! empty($validated['signature'])) {
                \App\Models\Contract::create([
                    'reservation_id' => $res->id,
                    'signature_data' => $validated['signature'],
                    'signed_at'      => now(),
                    'file_path'      => 'contracts/contract_' . $res->id . '.pdf',
                ]);
            }

            return $res;
        });

        // Notifications post-transaction
        $reservation->load(['client', 'vehicle', 'contract']);

        if ($reservation->status === 'confirmed') {
            if ($validated['payment_method'] === 'on_site') {
                $this->notificationService->notifyOnSiteReservation($reservation);
            } else {
                $this->notificationService->notifyReservationConfirmed($reservation);
            }

            if ($reservation->contract) {
                $contractCtrl = new ContractController($this->notificationService);
                $contractCtrl->generate($reservation);
            }
        }

        return response()->json($reservation, 201);
    }

    // ─── Détail d'une réservation ──────────────────────────────────────────────
    public function show(Reservation $reservation)
    {
        return response()->json(
            $reservation->load(['client', 'vehicle', 'payment', 'contract'])
        );
    }

    // ─── Mise à jour ───────────────────────────────────────────────────────────
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status'     => 'sometimes|string|in:pending,confirmed,ongoing,completed,cancelled,attente_paiement,pending_partner',
            'start_date' => 'sometimes|date',
            'end_date'   => 'sometimes|date|after:start_date',
            'vehicle_id' => 'sometimes|exists:vehicles,id',
        ]);

        if (isset($validated['start_date']) || isset($validated['end_date']) || isset($validated['vehicle_id'])) {
            $vehicleId = $validated['vehicle_id'] ?? $reservation->vehicle_id;
            $startDate = \Carbon\Carbon::parse($validated['start_date'] ?? $reservation->start_date);
            $endDate   = \Carbon\Carbon::parse($validated['end_date'] ?? $reservation->end_date);
            $days      = max(1, $startDate->diffInDays($endDate));

            $updated = DB::transaction(function () use ($validated, $reservation, $vehicleId, $startDate, $endDate, $days) {
                // ✅ Verrou pessimiste lors de la modification aussi
                $vehicle = Vehicle::lockForUpdate()->findOrFail($vehicleId);

                $isAvailable = ! $vehicle->reservations()
                    ->where('id', '!=', $reservation->id)
                    ->whereIn('status', ['confirmed', 'ongoing'])
                    ->where(function ($q) use ($startDate, $endDate) {
                        $q->whereBetween('start_date', [$startDate, $endDate])
                          ->orWhereBetween('end_date', [$startDate, $endDate])
                          ->orWhere(function ($q) use ($startDate, $endDate) {
                              $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                          });
                    })
                    ->exists();

                if (! $isAvailable) {
                    abort(422, 'Le véhicule n\'est pas disponible pour ces dates.');
                }

                // Recalcul du prix si les dates/véhicule ont changé
                $pricing = $this->pricing->calculateTotal(
                    $vehicle,
                    $days,
                    $reservation->options ?? [],
                    null,
                    $startDate
                );

                $validated['total_price'] = $pricing['total_price'];
                $reservation->update($validated);
                return $reservation;
            });

            return response()->json($updated);
        }

        $reservation->update($validated);
        return response()->json($reservation);
    }

    // ─── Accepter (partenaire) ─────────────────────────────────────────────────
    public function accept(Reservation $reservation)
    {
        if ($reservation->status !== 'pending_partner') {
            return response()->json(['message' => 'Statut de réservation invalide.'], 422);
        }

        $reservation->update(['status' => 'attente_paiement']);

        $contractCtrl = new ContractController($this->notificationService);
        $contractCtrl->generate($reservation);

        $this->notificationService->sendSms(
            $reservation->client->phone,
            "VectoriaRentCar: Votre demande #{$reservation->id} a ete ACCEPTEE. Merci de proceder au paiement pour confirmer."
        );

        return response()->json([
            'message'     => 'Réservation acceptée par le partenaire.',
            'reservation' => $reservation->fresh(['client', 'vehicle']),
        ]);
    }

    // ─── Rejeter (partenaire) ──────────────────────────────────────────────────
    public function reject(Reservation $reservation)
    {
        if ($reservation->status !== 'pending_partner') {
            return response()->json(['message' => 'Statut de réservation invalide.'], 422);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'message'     => 'Réservation rejetée par le partenaire.',
            'reservation' => $reservation->fresh(),
        ]);
    }
}
