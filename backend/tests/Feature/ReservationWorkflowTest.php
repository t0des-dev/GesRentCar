<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_partner_accept_flow()
    {
        $vehicle = Vehicle::factory()->create(['type' => 'collaborator']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'status' => 'pending_partner',
        ]);

        $reservation->acceptPartner();

        $this->assertEquals('pending_payment', $reservation->fresh()->status);
    }

    public function test_partner_refuse_flow()
    {
        $vehicle = Vehicle::factory()->create(['type' => 'collaborator']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'status' => 'pending_partner',
        ]);

        $reservation->refusePartner();

        $this->assertEquals('cancelled', $reservation->fresh()->status);
    }

    public function test_timeout_auto_cancels_reservation()
    {
        $vehicle = Vehicle::factory()->create(['type' => 'collaborator']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'status' => 'pending_partner',
            'created_at' => now()->subHours(2), // 2 hours ago
        ]);

        $isTimedOut = $reservation->checkTimeout();

        $this->assertTrue($isTimedOut);
        $this->assertEquals('cancelled', $reservation->fresh()->status);
    }

    public function test_cannot_accept_if_not_pending()
    {
        $vehicle = Vehicle::factory()->create(['type' => 'internal']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'status' => 'pending_payment',
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Cannot accept partner validation. Current status: pending_payment');

        $reservation->acceptPartner();
    }
}
