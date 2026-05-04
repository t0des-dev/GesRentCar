<?php

namespace App\Services;

use App\Models\Vehicle;

class PricingService
{
    /**
     * Calculate the dynamic daily rate based on occupancy.
     */
    public function getDynamicRate(Vehicle $vehicle, $occupancyRate = null)
    {
        $basePrice = $vehicle->price_per_day;
        $reason = null;
        $price = $basePrice;
        
        // 1. Occupancy based adjustments
        if ($occupancyRate === null) {
            $totalVehicles = Vehicle::count();
            $rentedVehicles = Vehicle::where('status', 'rented')->count();
            $occupancyRate = $totalVehicles > 0 ? ($rentedVehicles / $totalVehicles) : 0;
        }

        if ($occupancyRate > 0.8) {
            $price = $basePrice * 1.20;
            $reason = "Forte demande";
        } elseif ($occupancyRate < 0.3) {
            $price = $basePrice * 0.90;
            $reason = "Offre spéciale";
        }

        // 2. Weekend detection
        $isWeekend = in_array(date('N'), [5, 6, 7]); // Fri, Sat, Sun
        if ($isWeekend && !$reason) {
            $price = $basePrice * 1.10;
            $reason = "Tarif weekend";
        }

        return [
            'price' => round($price, 2),
            'reason' => $reason
        ];
    }
}
