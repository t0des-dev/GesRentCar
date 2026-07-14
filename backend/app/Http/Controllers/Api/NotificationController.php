<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $client = Client::where('email', $user->email)->first();

        if (! $client) {
            return response()->json(['notifications' => []]);
        }

        $reservations = Reservation::where('client_id', $client->id)
            ->with('vehicle:id,brand,model')
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'type' => $this->getType($r),
                'title' => $this->getTitle($r),
                'message' => $this->getMessage($r),
                'status' => $r->status,
                'created_at' => $r->updated_at,
                'read' => false,
            ]);

        return response()->json(['notifications' => $reservations]);
    }

    private function getType(Reservation $r): string
    {
        return match ($r->status) {
            'confirmed' => 'reservation_confirmed',
            'ongoing' => 'rental_started',
            'completed' => 'rental_completed',
            'cancelled' => 'reservation_cancelled',
            default => 'info',
        };
    }

    private function getTitle(Reservation $r): string
    {
        $vehicle = $r->vehicle ? "{$r->vehicle->brand} {$r->vehicle->model}" : 'véhicule';

        return match ($r->status) {
            'confirmed' => "Réservation confirmée - {$vehicle}",
            'ongoing' => "Location en cours - {$vehicle}",
            'completed' => "Location terminée - {$vehicle}",
            'cancelled' => "Réservation annulée - {$vehicle}",
            default => 'Mise à jour réservation',
        };
    }

    private function getMessage(Reservation $r): string
    {
        return match ($r->status) {
            'confirmed' => "Votre réservation pour {$r->vehicle->brand} {$r->vehicle->model} est confirmée.",
            'ongoing' => 'Votre location a commencé. Bon voyage !',
            'completed' => 'Votre location est terminée. Merci !',
            'cancelled' => 'Votre réservation a été annulée.',
            default => "Statut mis à jour: {$r->status}",
        };
    }
}
