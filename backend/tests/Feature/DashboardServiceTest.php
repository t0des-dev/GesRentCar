<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_revenue_calculation()
    {
        // $paid_amount casts to decimal
        Payment::factory()->create([
            'paid_amount' => 500,
            'type' => 'payment',
            'created_at' => Carbon::create(2026, 6, 15),
        ]);
        Payment::factory()->create([
            'paid_amount' => 1500,
            'type' => 'payment',
            'created_at' => Carbon::create(2026, 6, 20),
        ]);
        // Refund should be negative or handled, assuming it's negative based on our PaymentService
        Payment::factory()->create([
            'paid_amount' => -200,
            'type' => 'refund',
            'created_at' => Carbon::create(2026, 6, 25),
        ]);

        // Different month
        Payment::factory()->create([
            'paid_amount' => 1000,
            'type' => 'payment',
            'created_at' => Carbon::create(2026, 5, 15),
        ]);

        $service = new DashboardService;
        $revenue = $service->getMonthlyRevenue(2026, 6);

        // 500 + 1500 = 2000 (We excluded 'refund' type in sum, but technically the refund negative logic could be combined)
        // Since getMonthlyRevenue filters by ['payment', 'deposit'], it should be 2000
        $this->assertEquals(2000, $revenue);
    }

    public function test_export_csv_generation()
    {
        $vehicle = Vehicle::factory()->create(['plate' => 'EXPORT-1']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 999.99,
            'status' => 'confirmed',
        ]);

        $service = new DashboardService;
        $csv = $service->exportReservationsCSV();

        $this->assertStringContainsString('ID,Client,Vehicle,Start Date,End Date,Status,Total Price', $csv);
        $this->assertStringContainsString('EXPORT-1', $csv);
        $this->assertStringContainsString('999.99', $csv);
        $this->assertStringContainsString('confirmed', $csv);
    }
}
