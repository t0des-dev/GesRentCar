<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_search_available_vehicles()
    {
        Vehicle::factory()->create(['brand' => 'Mercedes', 'status' => 'available']);
        Vehicle::factory()->create(['brand' => 'BMW', 'status' => 'available']);

        $response = $this->getJson('/api/v1/vehicles');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_authenticated_user_can_create_reservation()
    {
        $user = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['price_per_day' => 1000]);
        $client = Client::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/reservations', [
            'client_id' => $client->id,
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-05-01',
            'end_date' => '2026-05-03',
        ]);

        $response->assertStatus(201);
    }

    public function test_cannot_reserve_already_booked_vehicle()
    {
        $user = User::factory()->create();
        $vehicle = Vehicle::factory()->create();
        $client = Client::factory()->create();

        // Create initial reservation
        $vehicle->reservations()->create([
            'client_id' => $client->id,
            'start_date' => '2026-05-01',
            'end_date' => '2026-05-05',
            'status' => 'confirmed',
            'total_price' => 5000,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/reservations', [
            'client_id' => $client->id,
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-05-03',
            'end_date' => '2026-05-07',
        ]);

        $response->assertStatus(422);
    }
}
