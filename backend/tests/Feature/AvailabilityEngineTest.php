<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Vehicle;
use App\Services\AvailabilityEngine;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityEngineTest extends TestCase
{
    use RefreshDatabase;

    public function test_prevents_double_booking_using_engine()
    {
        $engine = new AvailabilityEngine;
        $client = Client::factory()->create();
        $vehicle = Vehicle::factory()->create(['price_per_day' => 100, 'type' => 'internal']);

        // First booking succeeds
        $engine->secureBooking($vehicle->id, '2026-06-01', '2026-06-10', [
            'client_id' => $client->id,
        ]);

        // Second booking overlaps and must throw Exception
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Double booking detected');

        $engine->secureBooking($vehicle->id, '2026-06-05', '2026-06-15', [
            'client_id' => $client->id,
        ]);
    }

    public function test_calculates_10_percent_deposit_for_internal_vehicles()
    {
        $engine = new AvailabilityEngine;
        $client = Client::factory()->create();
        $vehicle = Vehicle::factory()->create(['price_per_day' => 100, 'type' => 'internal']);

        $reservation = $engine->secureBooking($vehicle->id, '2026-06-01', '2026-06-11', [ // 10 days
            'client_id' => $client->id,
        ]);

        $this->assertEquals(1000, $reservation->total_price);
        $this->assertEquals(100, $reservation->deposit_amount); // 10%
        $this->assertEquals('pending_payment', $reservation->status);
    }

    public function test_partner_vehicle_requires_partner_validation()
    {
        $engine = new AvailabilityEngine;
        $client = Client::factory()->create();
        $vehicle = Vehicle::factory()->create(['price_per_day' => 100, 'type' => 'collaborator']);

        $reservation = $engine->secureBooking($vehicle->id, '2026-07-01', '2026-07-05', [
            'client_id' => $client->id,
        ]);

        $this->assertEquals('pending_partner', $reservation->status);
        $this->assertEquals(0, $reservation->deposit_amount); // différé
    }
}
