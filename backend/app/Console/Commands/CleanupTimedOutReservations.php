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
        $timedOut = Reservation::where('status', 'pending_partner')
            ->where('created_at', '<=', now()->subHour())
            ->get();

        foreach ($timedOut as $reservation) {
            $reservation->update(['status' => 'cancelled']);
            $this->info("Cancelled reservation #{$reservation->id} due to partner timeout.");
        }

        $this->info("Cleanup completed. " . $timedOut->count() . " reservations cancelled.");
    }
}
