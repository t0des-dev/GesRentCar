<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConciergeController extends Controller
{
    /**
     * Chat endpoint for the AI Concierge.
     * Parses client request, queries actual database vehicles and suggests matching options.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
        ]);

        $message = strtolower($request->message);
        
        // 1. Fetch all vehicles to run matches
        $vehicles = Vehicle::where('status', 'available')->get();
        
        // 2. Identify the vibe and filter vehicles
        $recommended = collect();
        $vibeName = "votre voyage";

        if (Str::contains($message, ['sport', 'prestige', 'luxe', 'vitesse', 'puissance', 'run', 'gt'])) {
            $recommended = $vehicles->filter(fn($v) => in_array(strtolower($v->category), ['sport', 'prestige', 'luxury', 'supercar']) || $v->price_per_day > 1000);
            $vibeName = "Grand Tourisme & Performance";
        } elseif (Str::contains($message, ['famille', 'enfant', 'grand', 'spacieux', 'coffre', 'bagage', 'voyage'])) {
            $recommended = $vehicles->filter(fn($v) => in_array(strtolower($v->category), ['suv', 'family', 'break']) || $v->seats >= 5);
            $vibeName = "Family First & Confort";
        } elseif (Str::contains($message, ['business', 'travail', 'réunion', 'pro', 'affaires', 'bureau'])) {
            $recommended = $vehicles->filter(fn($v) => in_array(strtolower($v->category), ['berline', 'sedan', 'executive']) || strtolower($v->brand) === 'mercedes');
            $vibeName = "Business Elite";
        } elseif (Str::contains($message, ['aventure', 'wild', 'piste', '4x4', 'montagne', 'désert', 'campagne'])) {
            $recommended = $vehicles->filter(fn($v) => in_array(strtolower($v->category), ['suv', '4x4', 'offroad']) || str_contains(strtolower($v->model), 'range') || str_contains(strtolower($v->brand), 'jeep'));
            $vibeName = "Wild Adventure & Exploration";
        } else {
            // General recommendation or brand match
            foreach (['mercedes', 'range', 'bmw', 'audi', 'porsche', 'ferrari', 'bentley', 'rolls'] as $brand) {
                if (Str::contains($message, $brand)) {
                    $recommended = $vehicles->filter(fn($v) => strtolower($v->brand) === $brand);
                    $vibeName = "Univers " . ucfirst($brand);
                    break;
                }
            }
        }

        // Fallback: If no match or database empty, take top 3 premium available cars
        if ($recommended->isEmpty()) {
            $recommended = $vehicles->sortByDesc('price_per_day')->take(3);
            $vibeName = "Collection Premium";
        }

        // 3. Construct a natural language response
        $responseMessage = "";
        if ($recommended->isEmpty()) {
            $responseMessage = "Bonjour ! Je suis votre Concierge Vectoria. Malheureusement, notre flotte n'a pas de véhicule disponible pour le moment. Veuillez nous contacter directement pour un service sur mesure !";
        } else {
            $responseMessage = "Bonjour ! En tant que Concierge Virtuel Vectoria, j'ai analysé vos besoins. Pour un style axé sur **" . $vibeName . "**, voici la sélection de véhicules que je vous recommande particulièrement :\n\n";
            
            foreach ($recommended->take(3) as $vehicle) {
                $responseMessage .= "🔹 **" . $vehicle->brand . " " . $vehicle->model . "** (" . $vehicle->transmission . ", " . $vehicle->fuel_type . ")\n";
                $responseMessage .= "   👉 Tarif : " . number_format($vehicle->price_per_day, 0, '.', ' ') . " MAD / jour\n";
                if ($vehicle->horsepower) {
                    $responseMessage .= "   👉 Puissance : " . $vehicle->horsepower . " ch\n";
                }
                $responseMessage .= "\n";
            }
            
            $responseMessage .= "Souhaitez-vous que je bloque l'un de ces véhicules pour vos dates, ou préférez-vous affiner votre recherche ?";
        }

        return response()->json([
            'success' => true,
            'reply' => $responseMessage,
            'vibe' => $vibeName,
            'suggestions' => $recommended->take(3)->map(fn($v) => [
                'id' => $v->id,
                'brand' => $v->brand,
                'model' => $v->model,
                'price_per_day' => $v->price_per_day,
                'image_url' => $v->image_url,
            ])->values(),
        ]);
    }
}
