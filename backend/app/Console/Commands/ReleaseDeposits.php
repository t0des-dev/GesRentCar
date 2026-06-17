<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;

class ReleaseDeposits extends Command
{
    protected $signature = 'deposits:release';

    protected $description = 'Release held deposits for completed reservations';

    public function handle(PaymentService $paymentService): int
    {
        $completed = Reservation::where('status', 'completed')
            ->whereHas('payment', function ($q) {
                $q->where('type', 'deposit')->where('status', 'held');
            })
            ->with('payment')
            ->get();

        $released = 0;

        foreach ($completed as $reservation) {
            try {
                $paymentService->releaseDeposit($reservation);
                $released++;
                $this->info("Released deposit for reservation #{$reservation->id}");
            } catch (\Exception $e) {
                $this->error("Failed to release deposit for #{$reservation->id}: {$e->getMessage()}");
            }
        }

        $this->info("Done. Released {$released} deposit(s).");

        return 0;
    }
}
