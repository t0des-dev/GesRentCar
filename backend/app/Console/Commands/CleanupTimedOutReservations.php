<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Illuminate\Console\Command;

class CleanupTimedOutReservations extends Command
{
    protected $signature = 'reservations:cleanup-timeout';

    protected $description = 'Cancel collaborator reservations that have not been validated within 1 hour';

    public function handle()
    {
        // Cancel partner reservations older than 1 hour
        $partnerTimeout = Reservation::where('status', 'pending_partner')
            ->where('created_at', '<=', now()->subHour())
            ->get();

        foreach ($partnerTimeout as $reservation) {
            $reservation->update(['status' => 'cancelled']);
            $this->info("Cancelled reservation #{$reservation->id} due to partner timeout.");
        }

        // Cancel abandoned Stripe/CMI reservations older than 30 minutes
        $paymentTimeout = Reservation::where('status', 'pending_payment')
            ->where('created_at', '<=', now()->subMinutes(30))
            ->get();

        foreach ($paymentTimeout as $reservation) {
            $reservation->update(['status' => 'cancelled']);
            $this->info("Cancelled reservation #{$reservation->id} due to payment timeout.");
        }

        $total = $partnerTimeout->count() + $paymentTimeout->count();
        $this->info('Cleanup completed. '.$total.' reservations cancelled.');
    }
}
