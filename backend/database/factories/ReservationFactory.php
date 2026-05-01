<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'vehicle_id' => Vehicle::factory(),
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(5),
            'status' => 'pending',
            'total_price' => 1000.00,
        ];
    }
}
