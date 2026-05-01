<?php

use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Vehicle;
use App\Models\Client;
use Illuminate\Support\Facades\DB;

// Create some dummy clients and reservations if they don't exist
$client = Client::firstOrCreate(['email' => 'john@example.com'], [
    'name' => 'John Doe',
    'phone' => '0600000000',
    'cin' => 'AB123456',
    'driver_license' => 'LC-998877'
]);

$vehicle = Vehicle::first();

// Create 10 dummy payments over the last 6 months
for ($i = 0; $i < 10; $i++) {
    $date = now()->subMonths(rand(0, 5))->subDays(rand(1, 20));
    
    $reservation = Reservation::create([
        'client_id' => $client->id,
        'vehicle_id' => $vehicle->id,
        'start_date' => $date->format('Y-m-d'),
        'end_date' => $date->addDays(rand(1, 5))->format('Y-m-d'),
        'total_price' => rand(500, 5000),
        'status' => 'confirmed'
    ]);

    Payment::create([
        'reservation_id' => $reservation->id,
        'amount' => $reservation->total_price,
        'method' => 'cash',
        'status' => 'completed',
        'created_at' => $date,
        'updated_at' => $date
    ]);
}

echo "Created 10 dummy payments for analytics.\n";
