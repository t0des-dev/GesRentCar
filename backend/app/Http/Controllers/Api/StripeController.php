<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use App\Services\NotificationService;

class StripeController extends Controller
{
    protected NotificationService $notifications;

    public function __construct(NotificationService $notifications)
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $this->notifications = $notifications;
    }

    // ─── Step 1: Create a PaymentIntent for the deposit ───────────────────────
    public function createIntent(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id'      => 'required|exists:vehicles,id',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after:start_date',
            'client.name'     => 'required|string',
            'client.email'    => 'required|email',
            'client.phone'    => 'required|string',
            'client.cin'      => 'required|string',
            'client.license_number' => 'nullable|string',
            'amount'          => 'required|numeric|min:1', // Deposit amount in DH (integer)
            'signature'       => 'nullable|string',
        ]);

        // Create or find client
        $clientData = $validated['client'];
        $client = \App\Models\Client::firstOrCreate(
            ['email' => $clientData['email']],
            [
                'name'           => $clientData['name'],
                'phone'          => $clientData['phone'],
                'cin'            => $clientData['cin'],
                'license_number' => $clientData['license_number'] ?? null,
            ]
        );

        $vehicle  = \App\Models\Vehicle::findOrFail($validated['vehicle_id']);

        // Availability check
        if (!$vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
            return response()->json(['message' => 'Vehicle is not available for these dates.'], 422);
        }

        // Calculate total price
        $days  = (new \DateTime($validated['start_date']))->diff(new \DateTime($validated['end_date']))->days;
        if ($days == 0) $days = 1;
        $totalPrice = $days * $vehicle->price_per_day;
        $deposit    = $validated['amount']; // 10% computed on frontend

        // Create Stripe PaymentIntent (amount in centimes — Stripe requires smallest currency unit)
        // For MAD (Moroccan Dirham) we use 100 centimes = 1 DH
        $intent = PaymentIntent::create([
            'amount'   => (int) ($deposit * 100),
            'currency' => 'mad',
            'metadata' => [
                'client_id'  => $client->id,
                'vehicle_id' => $vehicle->id,
                'start_date' => $validated['start_date'],
                'end_date'   => $validated['end_date'],
                'total_price'=> $totalPrice,
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        // Create pending reservation
        $reservation = DB::transaction(function () use ($validated, $totalPrice, $deposit, $vehicle, $client, $intent, $request) {
            $status = $vehicle->type === 'collaborator' ? 'pending_partner' : 'pending_payment';

            $res = Reservation::create([
                'client_id'      => $client->id,
                'vehicle_id'     => $vehicle->id,
                'start_date'     => $validated['start_date'],
                'end_date'       => $validated['end_date'],
                'total_price'    => $totalPrice,
                'deposit_amount' => $deposit,
                'status'         => $status,
            ]);

            // If signature is provided, create the contract record now
            if ($request->filled('signature')) {
                \App\Models\Contract::create([
                    'reservation_id' => $res->id,
                    'signature_data' => $request->signature,
                    'signed_at'      => now(),
                ]);
            }

            return $res;
        });

        return response()->json([
            'client_secret'   => $intent->client_secret,
            'reservation_id'  => $reservation->id,
            'amount'          => $deposit,
            'total_price'     => $totalPrice,
        ]);
    }

    // ─── Step 2: Confirm after successful Stripe payment ──────────────────────
    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'reservation_id'   => 'required|exists:reservations,id',
            'payment_intent_id'=> 'required|string',
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);

        // Verify the intent with Stripe
        $intent = PaymentIntent::retrieve($validated['payment_intent_id']);

        if ($intent->status !== 'succeeded') {
            return response()->json(['message' => 'Payment not yet confirmed by Stripe.'], 422);
        }

        DB::transaction(function () use ($reservation, $intent) {
            // Record the payment
            Payment::create([
                'reservation_id' => $reservation->id,
                'paid_amount'    => $intent->amount / 100,
                'remaining'      => $reservation->total_price - ($intent->amount / 100),
                'status'         => 'partial',
            ]);

            // Update reservation
            $reservation->update(['status' => 'confirmed']);

            // 📄 Generate the signed contract PDF
            if ($reservation->contract) {
                // We use the ContractController to generate the PDF file
                $contractCtrl = new \App\Http\Controllers\Api\ContractController($this->notifications);
                $contractCtrl->generate($reservation);
            }
        });

        // 🔔 Trigger WhatsApp + SMS + Email notifications
        $this->notifications->notifyDepositPaid($reservation->load(['client', 'vehicle', 'contract']));

        return response()->json([
            'message'     => 'Reservation confirmed successfully.',
            'reservation' => $reservation->load(['client', 'vehicle']),
        ]);
    }

    // ─── Step 3: Stripe Webhook (optional – for production) ──────────────────
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig     = $request->header('Stripe-Signature');
        $secret  = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sig, $secret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;
            $meta   = $intent->metadata;

            Log::info("Stripe webhook: PaymentIntent {$intent->id} succeeded", (array) $meta);
        }

        return response()->json(['received' => true]);
    }
}
