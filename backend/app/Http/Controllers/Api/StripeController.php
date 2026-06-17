<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\NotificationService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeController extends Controller
{
    public function __construct(
        protected NotificationService $notifications,
        protected PricingService $pricing,
    ) {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // ─── Étape 1 : Créer un PaymentIntent pour l'acompte ─────────────────────
    public function createIntent(Request $request)
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
            'amount'                   => 'required|numeric|min:1',
            'signature'                => 'nullable|string',
            'options'                  => 'nullable|array',
        ]);

        $clientData = $validated['client'];
        $options    = $validated['options'] ?? [];
        $startDate  = \Carbon\Carbon::parse($validated['start_date']);
        $endDate    = \Carbon\Carbon::parse($validated['end_date']);
        $days       = max(1, $startDate->diffInDays($endDate));

        [$reservation, $totalPrice, $deposit] = DB::transaction(function () use (
            $validated, $clientData, $options, $startDate, $endDate, $days, $request
        ) {
            // ✅ Verrou pessimiste — empêche la double réservation concurrente
            $vehicle = Vehicle::lockForUpdate()->findOrFail($validated['vehicle_id']);

            if (! $vehicle->isAvailable($validated['start_date'], $validated['end_date'])) {
                abort(422, 'Le véhicule n\'est pas disponible pour ces dates.');
            }

            // Créer ou retrouver le client
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

            // ✅ Calcul centralisé via PricingService
            $pricingResult = $this->pricing->calculateTotal($vehicle, $days, $options, null, $startDate);
            $totalPrice    = $pricingResult['total_price'];
            $deposit       = (float) $validated['amount'];

            $status = $vehicle->type === 'collaborator' ? 'pending_partner' : 'pending_payment';

            $res = Reservation::create([
                'client_id'      => $client->id,
                'vehicle_id'     => $vehicle->id,
                'start_date'     => $validated['start_date'],
                'end_date'       => $validated['end_date'],
                'total_price'    => $totalPrice,
                'deposit_amount' => $deposit,
                'status'         => $status,
                'options'        => empty($options) ? null : $options,
            ]);

            if ($request->filled('signature')) {
                Contract::create([
                    'reservation_id' => $res->id,
                    'signature_data' => $request->signature,
                    'signed_at'      => now(),
                    'file_path'      => 'contracts/contract_' . $res->id . '.pdf',
                ]);
            }

            return [$res, $totalPrice, $deposit];
        });

        // Créer le PaymentIntent Stripe APRÈS la transaction (évite de bloquer la connexion DB)
        $intent = PaymentIntent::create([
            'amount'   => (int) ($deposit * 100),
            'currency' => 'mad',
            'metadata' => [
                'reservation_id' => $reservation->id,
                'client_id'      => $reservation->client_id,
                'vehicle_id'     => $reservation->vehicle_id,
                'total_price'    => $totalPrice,
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return response()->json([
            'client_secret'  => $intent->client_secret,
            'reservation_id' => $reservation->id,
            'amount'         => $deposit,
            'total_price'    => $totalPrice,
        ]);
    }

    // ─── Étape 2 : Confirmer après paiement Stripe (appelé par le frontend) ───
    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'reservation_id'    => 'required|exists:reservations,id',
            'payment_intent_id' => 'required|string',
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);

        // Vérification auprès de Stripe
        $intent = PaymentIntent::retrieve($validated['payment_intent_id']);

        if ($intent->status !== 'succeeded') {
            return response()->json(['message' => 'Paiement non encore confirmé par Stripe.'], 422);
        }

        $this->processConfirmedPayment($reservation, (float) ($intent->amount / 100));

        return response()->json([
            'message'     => 'Réservation confirmée avec succès.',
            'reservation' => $reservation->fresh()->load(['client', 'vehicle']),
        ]);
    }

    // ─── Étape 3 : Webhook Stripe (source de vérité en production) ────────────
    /**
     * Le webhook est la VRAIE source de vérité : il confirme la réservation
     * même si le client ferme son navigateur après le paiement.
     * L'endpoint /stripe/confirm reste en place pour un retour UI immédiat,
     * mais la logique est idempotente (Protection via statut + payment unique).
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig     = $request->header('Stripe-Signature');
        $secret  = config('services.stripe.webhook_secret');

        // ── Vérification de la signature Stripe ───────────────────────────────
        try {
            $event = Webhook::constructEvent($payload, $sig, $secret);
        } catch (SignatureVerificationException $e) {
            Log::warning('[Stripe Webhook] Invalid signature: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        Log::info('[Stripe Webhook] Event received: ' . $event->type, [
            'event_id' => $event->id,
        ]);

        // ── Dispatcher les événements pertinents ──────────────────────────────
        match ($event->type) {
            'payment_intent.succeeded'         => $this->handlePaymentSucceeded($event->data->object),
            'payment_intent.payment_failed'    => $this->handlePaymentFailed($event->data->object),
            'charge.dispute.created'           => $this->handleDisputeCreated($event->data->object),
            default                            => null,
        };

        return response()->json(['received' => true]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HANDLERS WEBHOOK PRIVÉS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Confirme la réservation suite au webhook payment_intent.succeeded.
     * Idempotent : ne fait rien si déjà confirmée.
     */
    private function handlePaymentSucceeded(object $intent): void
    {
        $reservationId = $intent->metadata->reservation_id ?? null;

        if (! $reservationId) {
            Log::warning('[Stripe Webhook] payment_intent.succeeded sans reservation_id dans metadata', [
                'intent_id' => $intent->id,
            ]);
            return;
        }

        $reservation = Reservation::find($reservationId);

        if (! $reservation) {
            Log::error("[Stripe Webhook] Réservation #{$reservationId} introuvable.");
            return;
        }

        // ── Idempotence : éviter le double traitement ─────────────────────────
        if ($reservation->status === 'confirmed') {
            Log::info("[Stripe Webhook] Réservation #{$reservationId} déjà confirmée. Skip.");
            return;
        }

        $paidAmount = (float) ($intent->amount / 100);

        $this->processConfirmedPayment($reservation, $paidAmount);

        Log::info("[Stripe Webhook] Réservation #{$reservationId} confirmée via webhook. Montant: {$paidAmount} MAD");
    }

    /**
     * Marque la réservation comme annulée si le paiement échoue définitivement.
     */
    private function handlePaymentFailed(object $intent): void
    {
        $reservationId = $intent->metadata->reservation_id ?? null;

        if (! $reservationId) {
            return;
        }

        $reservation = Reservation::find($reservationId);

        if ($reservation && $reservation->status === 'pending_payment') {
            $reservation->update(['status' => 'cancelled']);
            Log::info("[Stripe Webhook] Réservation #{$reservationId} annulée — paiement échoué.");

            // Notifier le client
            try {
                $reservation->load(['client', 'vehicle']);
                $refNum = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
                $this->notifications->sendSms(
                    $reservation->client->phone,
                    "VectoriaRentCar: Votre paiement pour {$refNum} a échoué. Veuillez réessayer ou nous contacter."
                );
            } catch (\Exception $e) {
                Log::warning('[Stripe Webhook] Notification paiement échoué: ' . $e->getMessage());
            }
        }
    }

    /**
     * Alerte l'admin en cas de litige (chargeback).
     */
    private function handleDisputeCreated(object $charge): void
    {
        $amount = number_format(($charge->amount ?? 0) / 100, 2);
        $this->notifications->notifyAdmin(
            "⚠️ LITIGE STRIPE : Un chargeback de {$amount} MAD a été ouvert. ID: {$charge->id}"
        );
        Log::warning('[Stripe Webhook] Dispute created', ['charge_id' => $charge->id]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LOGIQUE PARTAGÉE (confirm + webhook)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Confirme un paiement reçu : enregistre le Payment, met à jour le statut
     * de la réservation, génère le PDF du contrat et envoie les notifications.
     * Cette méthode est idempotente (vérification du statut + unique payment).
     */
    private function processConfirmedPayment(Reservation $reservation, float $paidAmount): void
    {
        DB::transaction(function () use ($reservation, $paidAmount) {
            // Verrou pour éviter les traitements webhook/confirm simultanés
            $reservation = Reservation::lockForUpdate()->findOrFail($reservation->id);

            if ($reservation->status === 'confirmed') {
                return; // déjà traité — idempotence
            }

            // Enregistrer le paiement (upsert pour idempotence)
            Payment::updateOrCreate(
                ['reservation_id' => $reservation->id],
                [
                    'paid_amount' => $paidAmount,
                    'remaining'   => max(0, $reservation->total_price - $paidAmount),
                    'status'      => $paidAmount >= $reservation->total_price ? 'full' : 'partial',
                ]
            );

            $reservation->update(['status' => 'confirmed']);

            // Générer le PDF du contrat si signé
            if ($reservation->contract) {
                \App\Jobs\GenerateContractPdf::dispatch($reservation->id, 'fr');
            }
        });

        // Notifications en dehors de la transaction
        try {
            $this->notifications->notifyDepositPaid(
                $reservation->fresh()->load(['client', 'vehicle', 'contract'])
            );
        } catch (\Exception $e) {
            Log::warning('[Stripe] Notification post-paiement échouée: ' . $e->getMessage());
        }
    }
}
