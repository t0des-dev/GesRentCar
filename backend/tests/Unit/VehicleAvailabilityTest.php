<?php

namespace Tests\Unit;

use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_vehicle_is_available_when_no_reservations_exist()
    {
        $vehicle = Vehicle::factory()->create();

        $this->assertTrue($vehicle->isAvailable('2026-05-01', '2026-05-05'));
    }

    public function test_vehicle_is_unavailable_when_dates_overlap_exactly()
    {
        $vehicle = Vehicle::factory()->create();
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-05-01 10:00:00',
            'end_date' => '2026-05-05 10:00:00',
            'status' => 'confirmed',
        ]);

        $this->assertFalse($vehicle->isAvailable('2026-05-01', '2026-05-05'));
    }

    public function test_vehicle_is_unavailable_when_dates_overlap_partially_start()
    {
        $vehicle = Vehicle::factory()->create();
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-05-03 10:00:00',
            'end_date' => '2026-05-10 10:00:00',
            'status' => 'confirmed',
        ]);

        $this->assertFalse($vehicle->isAvailable('2026-05-01', '2026-05-05'));
    }

    public function test_vehicle_is_unavailable_when_dates_overlap_partially_end()
    {
        $vehicle = Vehicle::factory()->create();
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-04-25 10:00:00',
            'end_date' => '2026-05-02 10:00:00',
            'status' => 'confirmed',
        ]);

        $this->assertFalse($vehicle->isAvailable('2026-05-01', '2026-05-05'));
    }

    public function test_vehicle_is_available_when_dates_do_not_overlap()
    {
        $vehicle = Vehicle::factory()->create();
        Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'start_date' => '2026-05-10 10:00:00',
            'end_date' => '2026-05-15 10:00:00',
            'status' => 'confirmed',
        ]);

        $this->assertTrue($vehicle->isAvailable('2026-05-01', '2026-05-05'));
    }
}
