<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class AnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = Client::firstOrCreate(['email' => 'john@example.com'], [
            'name' => 'John Doe',
            'phone' => '0600000000',
            'cin' => 'AB123456',
            'driver_license' => 'LC-998877',
        ]);

        $vehicles = Vehicle::all();
        if ($vehicles->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 20; $i++) {
            $vehicle = $vehicles->random();
            $date = now()->subMonths(rand(0, 5))->subDays(rand(1, 25));

            $reservation = Reservation::create([
                'client_id' => $client->id,
                'vehicle_id' => $vehicle->id,
                'start_date' => $date->format('Y-m-d'),
                'end_date' => $date->copy()->addDays(rand(1, 5))->format('Y-m-d'),
                'total_price' => rand(800, 8000),
                'status' => 'confirmed',
            ]);

            Payment::create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_price,
                'method' => 'cash',
                'status' => 'completed',
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }
}
