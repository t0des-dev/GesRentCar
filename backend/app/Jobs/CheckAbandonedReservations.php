<?php

namespace App\Jobs;

use App\Models\Reservation;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Vérifie les réservations abandonnées (statut pending_payment) et :
 * 1. Envoie un SMS de relance après 2h sans paiement
 * 2. Annule automatiquement après 24h sans paiement
 *
 * Ce job est conçu pour être schedulé toutes les heures.
 */
class CheckAbandonedReservations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 120;

    public function handle(NotificationService $notifications): void
    {
        $now = Carbon::now();

        // ── 1. Relance SMS après 2 heures (une seule fois) ───────────────────
        $toRemind = Reservation::with(['client:id,name,email,phone', 'vehicle:id,brand,model'])
            ->where('status', 'pending_payment')
            ->where('created_at', '<=', $now->copy()->subHours(2))
            ->where('created_at', '>', $now->copy()->subHours(3)) // fenêtre 2h–3h
            ->get();

        foreach ($toRemind as $reservation) {
            try {
                $refNum  = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
                $vehicle = $reservation->vehicle;
                $client  = $reservation->client;

                if (! $client?->phone) {
                    continue;
                }

                $notifications->sendSms(
                    $client->phone,
                    "VectoriaRentCar: Votre réservation {$refNum} ({$vehicle->brand} {$vehicle->model}) est en attente de paiement. "
                    . "Finalisez votre paiement pour sécuriser votre véhicule, sinon elle sera annulée sous 22h."
                );

                $notifications->sendWhatsApp(
                    $client->phone,
                    "⏰ *VRC — Rappel de paiement*\n\n"
                    . "Bonjour *{$client->name}*, votre réservation *{$refNum}* pour la *{$vehicle->brand} {$vehicle->model}* "
                    . "est toujours en attente de paiement.\n\n"
                    . "💳 Complétez votre paiement pour ne pas perdre votre réservation !\n\n"
                    . "_Vectoria Rent Car — Excellence & Prestige_"
                );

                Log::info("[AbandonedReservations] Relance envoyée pour #{$reservation->id}");
            } catch (\Exception $e) {
                Log::warning("[AbandonedReservations] Relance échouée #{$reservation->id}: " . $e->getMessage());
            }
        }

        // ── 2. Annulation automatique après 24 heures ─────────────────────────
        $toCancel = Reservation::with(['client:id,name,email,phone', 'vehicle:id,brand,model'])
            ->where('status', 'pending_payment')
            ->where('created_at', '<=', $now->copy()->subHours(24))
            ->get();

        foreach ($toCancel as $reservation) {
            try {
                $refNum  = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
                $client  = $reservation->client;

                $reservation->update(['status' => 'cancelled']);

                if ($client?->phone) {
                    $notifications->sendSms(
                        $client->phone,
                        "VectoriaRentCar: Votre réservation {$refNum} a été annulée automatiquement suite à l'absence de paiement. "
                        . "N'hésitez pas à réserver à nouveau sur notre site."
                    );
                }

                Log::info("[AbandonedReservations] Réservation #{$reservation->id} annulée automatiquement.");
            } catch (\Exception $e) {
                Log::error("[AbandonedReservations] Annulation échouée #{$reservation->id}: " . $e->getMessage());
            }
        }

        Log::info(
            sprintf(
                '[AbandonedReservations] Traitement terminé. Relances: %d | Annulations: %d',
                $toRemind->count(),
                $toCancel->count()
            )
        );
    }
}
