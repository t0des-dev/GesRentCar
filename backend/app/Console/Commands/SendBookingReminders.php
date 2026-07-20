<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Notifications\BookingReminder;
use Illuminate\Console\Command;

class SendBookingReminders extends Command
{
    protected $signature = 'reminders:send-booking';

    protected $description = 'Send booking reminder emails for reservations starting tomorrow';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->startOfDay();
        $endOfTomorrow = now()->addDay()->endOfDay();

        $reservations = Reservation::where('start_date', '>=', $tomorrow)
            ->where('start_date', '<=', $endOfTomorrow)
            ->whereIn('status', ['confirmed', 'pending_payment'])
            ->with('vehicle')
            ->get();

        $count = 0;
        foreach ($reservations as $reservation) {
            try {
                $reservation->notify(new BookingReminder($reservation));
                $count++;
            } catch (\Exception $e) {
                $this->error("Failed to send reminder for reservation #{$reservation->id}: {$e->getMessage()}");
            }
        }

        $this->info("Sent {$count} booking reminders for ".$tomorrow->format('d/m/Y'));

        return Command::SUCCESS;
    }
}
