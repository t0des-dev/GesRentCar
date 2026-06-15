<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Services\NotificationService;

class ReservationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    public function index(Request $request)
    {
        return response()->json(Reservation::with(['client', 'vehicle'])->latest('id')->get());
    }

    public function my(Request $request)
    {
        $user = $request->user();
        $reservations = Reservation::whereHas('client', function($q) use ($user) {
            $q->where('email', $user->email);
        })->with(['vehicle', 'client'])->get();

        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'options' => 'nullable|array',
        ]);

        $vehicle = Vehicle::findOrFail($validated['vehicle_id']);

        // Non-overlapping check
        if (!$vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
            return response()->json(['message' => 'Vehicle is not available for these dates.'], 422);
        }

        // Calculate total price
        $days = (new \DateTime($validated['start_date']))->diff(new \DateTime($validated['end_date']))->days;
        if ($days == 0) $days = 1;
        
        $totalPrice = $days * $vehicle->price_per_day;

        // Add options price
        $optionsData = $validated['options'] ?? [];
        if (isset($optionsData['flexibility']) && $optionsData['flexibility'] === 'flexible') {
            $totalPrice += 60 * $days;
        }
        if (isset($optionsData['mileage']) && $optionsData['mileage'] === 'unlimited') {
            $totalPrice += 140 * $days;
        }

        $reservation = DB::transaction(function () use ($validated, $totalPrice, $vehicle, $optionsData) {
            $status = $vehicle->type === 'collaborator' ? 'pending_partner' : 'confirmed';
            
            return Reservation::create(array_merge($validated, [
                'total_price' => $totalPrice,
                'status' => $status,
                'options' => empty($optionsData) ? null : $optionsData,
            ]));
        });

        if ($reservation->status === 'confirmed') {
            $this->notificationService->notifyReservationConfirmed($reservation);
        }

        return response()->json($reservation, 201);
    }

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

        $vehicle = Vehicle::findOrFail($validated['vehicle_id']);

        // Non-overlapping check
        if (!$vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
            return response()->json(['message' => 'Vehicle is not available for these dates.'], 422);
        }

        // Create or find client
        $clientData = $validated['client'];
        $client = Client::firstOrCreate(
            ['email' => $clientData['email']],
            [
                'name' => $clientData['name'],
                'phone' => $clientData['phone'],
                'cin' => $clientData['cin'],
                'license_number' => $clientData['license_number'] ?? null,
                'cin_image_url' => $clientData['cin_image_url'] ?? null,
                'license_image_url' => $clientData['license_image_url'] ?? null,
            ]
        );

        // Calculate total price
        $days = (new \DateTime($validated['start_date']))->diff(new \DateTime($validated['end_date']))->days;
        if ($days == 0) $days = 1;
        
        $totalPrice = $days * $vehicle->price_per_day;

        // Add options price
        $optionsData = $validated['options'] ?? [];
        if (isset($optionsData['flexibility']) && $optionsData['flexibility'] === 'flexible') {
            $totalPrice += 60 * $days;
        }
        if (isset($optionsData['mileage']) && $optionsData['mileage'] === 'unlimited') {
            $totalPrice += 140 * $days;
        }

        $reservation = DB::transaction(function () use ($validated, $totalPrice, $vehicle, $client, $optionsData) {
            $status = $vehicle->type === 'collaborator' ? 'pending_partner' : 'confirmed';
            
            // For on_site, we still mark as confirmed but with payment_method in metadata if needed, 
            // or just rely on the fact that no payment was recorded yet.
            
            $res = Reservation::create([
                'client_id' => $client->id,
                'vehicle_id' => $vehicle->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_price' => $totalPrice,
                'status' => $status,
                'payment_method' => $validated['payment_method'],
                'options' => empty($optionsData) ? null : $optionsData,
            ]);

            if (isset($validated['signature'])) {
                \App\Models\Contract::create([
                    'reservation_id' => $res->id,
                    'signature_data' => $validated['signature'],
                    'signed_at' => now(),
                    'file_path' => 'contracts/contract_' . $res->id . '.pdf',
                ]);
            }

            return $res;
        });

        if ($reservation->status === 'confirmed') {
            if ($reservation->payment_method === 'on_site') {
                $this->notificationService->notifyOnSiteReservation($reservation);
            } else {
                $this->notificationService->notifyReservationConfirmed($reservation);
            }
            
            // 📄 Automate contract generation if signature exists
            if ($reservation->contract) {
                $contractCtrl = new \App\Http\Controllers\Api\ContractController($this->notificationService);
                $contractCtrl->generate($reservation);
            }
        }

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load(['client', 'vehicle', 'payment', 'contract']));
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,confirmed,ongoing,completed,cancelled,attente_paiement',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'vehicle_id' => 'sometimes|exists:vehicles,id',
        ]);

        if (isset($validated['start_date']) || isset($validated['end_date']) || isset($validated['vehicle_id'])) {
            $vehicleId = $validated['vehicle_id'] ?? $reservation->vehicle_id;
            $startDate = $validated['start_date'] ?? $reservation->start_date;
            $endDate = $validated['end_date'] ?? $reservation->end_date;
            
            $vehicle = Vehicle::findOrFail($vehicleId);
            
            // Check availability (excluding current reservation)
            $isAvailable = !$vehicle->reservations()
                ->where('id', '!=', $reservation->id)
                ->whereIn('status', ['confirmed', 'ongoing'])
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                          ->orWhereBetween('end_date', [$startDate, $endDate])
                          ->orWhere(function ($query) use ($startDate, $endDate) {
                              $query->where('start_date', '<=', $startDate)
                                    ->where('end_date', '>=', $endDate);
                          });
                })->exists();

            if (!$isAvailable) {
                return response()->json(['message' => 'Le véhicule n\'est pas disponible pour ces dates.'], 422);
            }
            
            // Recalculate price if dates changed
            $days = (new \DateTime($startDate))->diff(new \DateTime($endDate))->days;
            if ($days == 0) $days = 1;
            $validated['total_price'] = $days * $vehicle->price_per_day;
        }

        $reservation->update($validated);

        return response()->json($reservation);
    }

    public function accept(Reservation $reservation)
    {
        if ($reservation->status !== 'pending_partner') {
            return response()->json(['message' => 'Invalid reservation status.'], 422);
        }

        $reservation->update(['status' => 'attente_paiement']);

        // 📄 Automate contract generation
        $contractCtrl = new \App\Http\Controllers\Api\ContractController($this->notificationService);
        $contractCtrl->generate($reservation);

        $this->notificationService->sendSms(
            $reservation->client->phone, 
            "VectoriaRentCar: Votre demande #{$reservation->id} a ete ACCEPTEE. Merci de proceder au paiement pour confirmer."
        );

        return response()->json(['message' => 'Reservation accepted by partner.', 'reservation' => $reservation]);
    }

    public function reject(Reservation $reservation)
    {
        if ($reservation->status !== 'pending_partner') {
            return response()->json(['message' => 'Invalid reservation status.'], 422);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Reservation rejected by partner.', 'reservation' => $reservation]);
    }
}
