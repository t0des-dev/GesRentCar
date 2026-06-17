<?php

use App\Jobs\CheckAbandonedReservations;
use App\Services\NotificationService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Tâches planifiées VectoriaRentCar ───────────────────────────────────────

/**
 * Vérifie les réservations abandonnées toutes les heures.
 * - Relance SMS/WhatsApp après 2h sans paiement
 * - Annulation automatique après 24h sans paiement
 */
Schedule::job(new CheckAbandonedReservations)->hourly()
    ->name('check-abandoned-reservations')
    ->withoutOverlapping()
    ->onFailure(function () {
        app(NotificationService::class)->notifyAdmin(
            '⚠️ [SCHEDULER] Le job CheckAbandonedReservations a échoué.'
        );
    });

/**
 * Vérification quotidienne des alertes documents véhicules
 * (assurance, visite technique, vignette) et maintenances planifiées.
 */
Schedule::call(function () {
    app(NotificationService::class)->checkMaintenanceAlerts();
})->dailyAt('08:00')
  ->name('check-maintenance-alerts')
  ->withoutOverlapping();
