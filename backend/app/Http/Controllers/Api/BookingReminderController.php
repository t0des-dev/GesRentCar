<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;

class BookingReminderController extends Controller
{
    public function sendReminders()
    {
        try {
            $tomorrow = Carbon::tomorrow();

            $reservations = Reservation::with(['client', 'vehicle'])
                ->where('status', 'confirmed')
                ->whereDate('start_date', $tomorrow)
                ->get();

            $sentCount = 0;

            foreach ($reservations as $reservation) {
                if ($reservation->client && $reservation->client->email) {
                    Notification::route('mail', $reservation->client->email)
                        ->notify(new \App\Notifications\BookingReminder($reservation));
                    $sentCount++;
                }
            }

            return response()->json([
                'message' => "Sent {$sentCount} booking reminders.",
                'total_reservations' => $reservations->count(),
                'sent' => $sentCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send reminders.', 'message' => $e->getMessage()], 500);
        }
    }
}
