<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'reservation_id' => Reservation::factory(),
            'paid_amount' => $this->faker->randomFloat(2, 50, 1000),
            'remaining' => 0,
            'payment_method' => $this->faker->randomElement(['credit_card', 'cash', 'bank_transfer']),
            'type' => 'payment',
            'status' => $this->faker->randomElement(['completed', 'pending', 'failed']),
            'transaction_id' => $this->faker->uuid(),
        ];
    }
}
