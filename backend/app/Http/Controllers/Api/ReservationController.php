<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\NotificationService;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Refund;
use Stripe\Stripe;

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
            'client_id' => 'required|exists:clients,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'options' => 'nullable|array',
        ]);

        $options = $validated['options'] ?? [];
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = max(1, $startDate->diffInDays($endDate));

        $reservation = DB::transaction(function () use ($validated, $options, $startDate, $days) {
            // ✅ Verrou pessimiste : empêche la double réservation concurrente
            $vehicle = Vehicle::lockForUpdate()->findOrFail($validated['vehicle_id']);

            if (! $vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
                abort(422, 'Le véhicule n\'est pas disponible pour ces dates.');
            }

            $pricing = $this->pricing->calculateTotal($vehicle, $days, $options, null, $startDate);
            $status = $vehicle->type === 'collaborator' ? 'pending_partner' : 'confirmed';

            return Reservation::create([
                'client_id' => $validated['client_id'],
                'vehicle_id' => $vehicle->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_price' => $pricing['total_price'],
                'deposit_amount' => round($pricing['total_price'] * 0.10, 2),
                'status' => $status,
                'options' => empty($options) ? null : $options,
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
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'client.name' => 'required|string',
            'client.email' => 'required|email',
            'client.phone' => 'required|string',
            'client.cin' => 'required|string',
            'client.license_number' => 'nullable|string',
            'client.cin_image_url' => 'nullable|string',
            'client.license_image_url' => 'nullable|string',
            'payment_method' => 'required|string|in:cash,cmi,transfer,stripe,on_site',
            'signature' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        $clientData = $validated['client'];
        $options = $validated['options'] ?? [];
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = max(1, $startDate->diffInDays($endDate));

        $reservation = DB::transaction(function () use ($validated, $clientData, $options, $startDate, $days) {
            // ✅ Verrou pessimiste
            $vehicle = Vehicle::lockForUpdate()->findOrFail($validated['vehicle_id']);

            if (! $vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
                abort(422, 'Le véhicule n\'est pas disponible pour ces dates.');
            }

            // Find existing client by CIN, email, or license — avoid unique constraint violations
            $client = Client::where('cin', $clientData['cin'])
                ->orWhere('email', $clientData['email'])
                ->when($clientData['license_number'] ?? null, fn ($q) => $q->orWhere('license_number', $clientData['license_number']))
                ->first();

            if ($client) {
                $client->update([
                    'name' => $clientData['name'],
                    'phone' => $clientData['phone'],
                    'license_number' => $clientData['license_number'] ?? $client->license_number,
                    'cin_image_url' => $clientData['cin_image_url'] ?? $client->cin_image_url,
                    'license_image_url' => $clientData['license_image_url'] ?? $client->license_image_url,
                ]);
            } else {
                $client = Client::create([
                    'name' => $clientData['name'],
                    'email' => $clientData['email'],
                    'phone' => $clientData['phone'],
                    'cin' => $clientData['cin'],
                    'license_number' => $clientData['license_number'] ?? null,
                    'cin_image_url' => $clientData['cin_image_url'] ?? null,
                    'license_image_url' => $clientData['license_image_url'] ?? null,
                ]);
            }

            $pricing = $this->pricing->calculateTotal($vehicle, $days, $options, null, $startDate);
            $status = $vehicle->type === 'collaborator' ? 'pending_partner' : 'confirmed';

            $res = Reservation::create([
                'client_id' => $client->id,
                'vehicle_id' => $vehicle->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_price' => $pricing['total_price'],
                'deposit_amount' => round($pricing['total_price'] * 0.10, 2),
                'status' => $status,
                'payment_method' => $validated['payment_method'],
                'options' => empty($options) ? null : $options,
            ]);

            if (! empty($validated['signature'])) {
                Contract::create([
                    'reservation_id' => $res->id,
                    'signature_data' => $validated['signature'],
                    'signed_at' => now(),
                    'file_path' => 'contracts/contract_'.$res->id.'.pdf',
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
            'status' => 'sometimes|string|in:pending,pending_payment,confirmed,ongoing,completed,cancelled,pending_partner',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'vehicle_id' => 'sometimes|exists:vehicles,id',
            'cancel_reason' => 'sometimes|nullable|string',
        ]);

        // Validate status transitions
        if (isset($validated['status'])) {
            $allowedTransitions = [
                'pending' => ['confirmed', 'cancelled'],
                'pending_payment' => ['confirmed', 'cancelled'],
                'pending_partner' => ['pending_payment', 'cancelled'],
                'attente_paiement' => ['confirmed', 'cancelled'],
                'confirmed' => ['ongoing', 'cancelled'],
                'ongoing' => ['completed'],
            ];
            $currentStatus = $reservation->status;
            $newStatus = $validated['status'];
            if (isset($allowedTransitions[$currentStatus]) && ! in_array($newStatus, $allowedTransitions[$currentStatus])) {
                return response()->json(['message' => "Transition de {$currentStatus} vers {$newStatus} non autorisée."], 422);
            }
        }

        if (isset($validated['cancel_reason'])) {
            $docs = $reservation->documents ?? [];
            $docs['cancel_reason'] = $validated['cancel_reason'];
            $reservation->update(['documents' => $docs]);
            unset($validated['cancel_reason']);
        }

        if (isset($validated['start_date']) || isset($validated['end_date']) || isset($validated['vehicle_id'])) {
            $vehicleId = $validated['vehicle_id'] ?? $reservation->vehicle_id;
            $startDate = Carbon::parse($validated['start_date'] ?? $reservation->start_date);
            $endDate = Carbon::parse($validated['end_date'] ?? $reservation->end_date);
            $days = max(1, $startDate->diffInDays($endDate));

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

                if (isset($validated['status']) && $validated['status'] === 'completed') {
                    try {
                        $reservation->load('client', 'vehicle');
                        if ($reservation->client && $reservation->client->email) {
                            $user = \App\Models\User::where('email', $reservation->client->email)->first();
                            if ($user) {
                                $user->notify(new \App\Notifications\RentalCompleted($reservation));
                            }
                        }
                    } catch (\Throwable $e) {
                        \Illuminate\Support\Facades\Log::warning('Completion notification failed', ['error' => $e->getMessage()]);
                    }
                }

                return $reservation;
            });

            return response()->json($updated);
        }

        $reservation->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'completed') {
            try {
                $reservation->load('client', 'vehicle');
                if ($reservation->client && $reservation->client->email) {
                    $user = \App\Models\User::where('email', $reservation->client->email)->first();
                    if ($user) {
                        $user->notify(new \App\Notifications\RentalCompleted($reservation));
                    }
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Completion notification failed', ['error' => $e->getMessage()]);
            }
        }

        return response()->json($reservation);
    }

    // ─── Accepter (partenaire) ─────────────────────────────────────────────────
    public function accept(Reservation $reservation)
    {
        if ($reservation->status !== 'pending_partner') {
            return response()->json(['message' => 'Statut de réservation invalide.'], 422);
        }

        $reservation->load(['client', 'vehicle']);
        $reservation->update(['status' => 'pending_payment']);

        try {
            $contractCtrl = new ContractController($this->notificationService);
            $contractCtrl->generate($reservation);
        } catch (\Throwable $e) {
            Log::warning('Contract generation failed after accept', ['reservation_id' => $reservation->id, 'error' => $e->getMessage()]);
        }

        try {
            if ($reservation->client && $reservation->client->phone) {
                $this->notificationService->sendSms(
                    $reservation->client->phone,
                    "VectoriaRentCar: Votre demande #{$reservation->id} a ete ACCEPTEE. Merci de proceder au paiement pour confirmer."
                );
            }
        } catch (\Throwable $e) {
            Log::warning('SMS notification failed after accept', ['reservation_id' => $reservation->id, 'error' => $e->getMessage()]);
        }

        return response()->json([
            'message' => 'Réservation acceptée par le partenaire.',
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
            'message' => 'Réservation rejetée par le partenaire.',
            'reservation' => $reservation->fresh(['client', 'vehicle']),
        ]);
    }

    // ─── Annulation (client ou admin) ─────────────────────────────────────────
    /**
     * Annule une réservation.
     * - Si le client avait choisi la flexibilité et payé via Stripe → remboursement automatique.
     * - Notifie le client par SMS/WhatsApp.
     * - Logge dans activity_logs.
     */
    public function cancel(Reservation $reservation)
    {
        $cancellableStatuses = ['pending', 'pending_payment', 'confirmed', 'pending_partner'];

        if (! in_array($reservation->status, $cancellableStatuses)) {
            return response()->json([
                'message' => "Impossible d'annuler une réservation en statut : {$reservation->status}.",
            ], 422);
        }

        $reservation->load(['client', 'vehicle', 'payment']);
        $refundResult = null;

        // ── Remboursement Stripe si flexibilité active et paiement existant ──────
        if (
            ($reservation->options['flexibility'] ?? null) === 'flexible'
            && $reservation->payment
            && $reservation->payment->status !== 'refunded'
        ) {
            $refundResult = $this->processStripeRefund($reservation);
        }

        DB::transaction(function () use ($reservation) {
            $reservation->update(['status' => 'cancelled']);

            // Audit log
            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'reservation_cancelled',
                'description' => "Réservation #{$reservation->id} annulée. Client: {$reservation->client->name}.",
                'ip_address' => request()->ip(),
            ]);
        });

        // Notification client
        try {
            $refNum = 'VRC-'.str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
            $this->notificationService->sendSms(
                $reservation->client->phone,
                "VectoriaRentCar: Votre réservation {$refNum} a été annulée."
                .($refundResult ? " Remboursement de {$refundResult['amount']} MAD initié." : '')
            );
        } catch (\Exception $e) {
            Log::warning('[Cancel] SMS notification failed: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Réservation annulée avec succès.',
            'reservation' => $reservation->fresh(),
            'refund' => $refundResult,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS PRIVÉS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Déclenche un remboursement Stripe pour le paiement d'une réservation.
     * Retourne les détails du remboursement ou null en cas d'échec.
     */
    private function processStripeRefund(Reservation $reservation): ?array
    {
        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            // Remboursement via Charge (plus fiable)
            $refundAmount = (int) ($reservation->payment->paid_amount * 100);

            $refund = Refund::create([
                'payment_intent' => $this->findStripePaymentIntent($reservation),
                'amount' => $refundAmount,
                'reason' => 'requested_by_customer',
                'metadata' => [
                    'reservation_id' => $reservation->id,
                    'reason' => 'flexible_cancellation',
                ],
            ]);

            // Mettre à jour le statut du paiement
            $reservation->payment->update(['status' => 'refunded']);

            Log::info("[Refund] Réservation #{$reservation->id} remboursée. Refund ID: {$refund->id}");

            return [
                'refund_id' => $refund->id,
                'amount' => $reservation->payment->paid_amount,
                'status' => $refund->status,
            ];
        } catch (\Exception $e) {
            Log::error("[Refund] Échec remboursement réservation #{$reservation->id}: ".$e->getMessage());

            return null;
        }
    }

    /**
     * Retrouve le payment_intent_id Stripe lié à une réservation
     * via les PaymentIntents avec metadata.reservation_id.
     */
    private function findStripePaymentIntent(Reservation $reservation): ?string
    {
        try {
            $intents = PaymentIntent::search([
                'query' => "metadata['reservation_id']:'{$reservation->id}'",
            ]);

            return $intents->data[0]->id ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
