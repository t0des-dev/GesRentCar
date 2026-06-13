<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class MaintenanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(),
            'type' => $this->faker->randomElement(['oil', 'tires', 'insurance', 'tech_visit']),
            'next_due' => now()->addDays(30),
            'status' => 'pending',
        ];
    }
}
