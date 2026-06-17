<?php

namespace Tests\Unit;

use App\Models\Client;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\AvailabilityEngine;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityEngineTest extends TestCase
{
    use RefreshDatabase;

    protected AvailabilityEngine $engine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->engine = new AvailabilityEngine;
    }

    public function test_is_available_when_no_reservations(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);

        $result = $this->engine->isAvailable($vehicle->id, '2026-07-01', '2026-07-05');

        $this->assertTrue($result);
    }

    public function test_is_not_available_when_dates_overlap(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-05',
            'status' => 'confirmed',
        ]);

        $result = $this->engine->isAvailable($vehicle->id, '2026-07-03', '2026-07-07');

        $this->assertFalse($result);
    }

    public function test_is_available_after_existing_reservation(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-05',
            'status' => 'confirmed',
        ]);

        $result = $this->engine->isAvailable($vehicle->id, '2026-07-06', '2026-07-10');

        $this->assertTrue($result);
    }

    public function test_secure_booking_creates_reservation(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available', 'type' => 'internal']);
        $client = Client::factory()->create();

        $reservation = $this->engine->secureBooking(
            $vehicle->id,
            '2026-07-01',
            '2026-07-05',
            [
                'client_id' => $client->id,
            ]
        );

        $this->assertNotNull($reservation);
        $this->assertEquals($vehicle->id, $reservation->vehicle_id);
        $this->assertContains($reservation->status, ['pending_payment', 'pending_partner']);
        $this->assertGreaterThan(0, $reservation->total_price);
    }

    public function test_secure_booking_throws_on_maintenance_vehicle(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'maintenance']);

        $this->expectException(Exception::class);
        $this->engine->secureBooking($vehicle->id, '2026-07-01', '2026-07-05', ['client_id' => 1]);
    }

    public function test_secure_booking_throws_on_invalid_dates(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid date range');
        $this->engine->secureBooking($vehicle->id, '2026-07-05', '2026-07-01', ['client_id' => 1]);
    }

    public function test_secure_booking_throws_on_overlapping_reservation(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available', 'type' => 'internal']);
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-05',
            'status' => 'confirmed',
        ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Double booking detected');
        $this->engine->secureBooking($vehicle->id, '2026-07-03', '2026-07-07', ['client_id' => 1]);
    }

    public function test_secure_booking_calculates_deposit_for_internal(): void
    {
        $vehicle = Vehicle::factory()->create([
            'status' => 'available',
            'type' => 'internal',
            'price_per_day' => 500,
        ]);
        $client = Client::factory()->create();

        $reservation = $this->engine->secureBooking(
            $vehicle->id,
            '2026-07-01',
            '2026-07-05',
            ['client_id' => $client->id]
        );

        $expectedDeposit = ($vehicle->price_per_day * 4) * 0.10;
        $this->assertEquals($expectedDeposit, $reservation->deposit_amount);
    }

    public function test_secure_booking_zero_deposit_for_collaborator(): void
    {
        $vehicle = Vehicle::factory()->create([
            'status' => 'available',
            'type' => 'collaborator',
            'price_per_day' => 500,
        ]);
        $client = Client::factory()->create();

        $reservation = $this->engine->secureBooking(
            $vehicle->id,
            '2026-07-01',
            '2026-07-05',
            ['client_id' => $client->id]
        );

        $this->assertEquals(0, $reservation->deposit_amount);
    }
}
