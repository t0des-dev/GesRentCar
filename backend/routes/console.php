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

/**
 * Backup quotidien de la base de données à 03:00.
 * - pg_dump avec compression gzip
 * - Upload vers S3/MinIO
 * - Rétention 30 jours
 */
Schedule::command('db:backup', ['--compress', '--upload', '--retention' => 30])
    ->dailyAt('03:00')
    ->name('daily-database-backup')
    ->withoutOverlapping()
    ->onFailure(function () {
        app(NotificationService::class)->notifyAdmin(
            '🔴 [BACKUP] Le backup quotidien de la base de données a échoué.'
        );
    });

/**
 * Libération automatique des cautions pour les réservations terminées.
 */
Schedule::command('deposits:release')->daily()
    ->name('release-deposits')
    ->withoutOverlapping();
