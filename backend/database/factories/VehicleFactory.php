<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'brand' => $this->faker->company(),
            'model' => $this->faker->word(),
            'plate' => $this->faker->unique()->bothify('####-?-#'),
            'price_per_day' => $this->faker->randomFloat(2, 200, 2000),
            'status' => 'available',
            'type' => 'internal',
        ];
    }
}
