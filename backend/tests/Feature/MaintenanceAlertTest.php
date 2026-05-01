<?php

namespace Tests\Feature;

use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class MaintenanceAlertTest extends TestCase
{
    use RefreshDatabase;

    public function test_date_based_maintenance_alert_warning()
    {
        Log::shouldReceive('channel')->with('single')->andReturnSelf();
        Log::shouldReceive('info')->withArgs(function ($message) {
            return str_contains($message, '[WARNING] Maintenance insurance due on');
        })->once();

        $vehicle = Vehicle::factory()->create(['plate' => 'ABC-123']);
        Maintenance::factory()->create([
            'vehicle_id' => $vehicle->id,
            'type' => 'insurance',
            'next_due' => now()->addDays(15), // Within 30 days
            'status' => 'pending'
        ]);

        Artisan::call('maintenance:check-alerts');
    }

    public function test_date_based_maintenance_alert_urgent()
    {
        Log::shouldReceive('channel')->with('single')->andReturnSelf();
        Log::shouldReceive('info')->withArgs(function ($message) {
            return str_contains($message, '[URGENT] Maintenance tech_visit due on');
        })->once();

        $vehicle = Vehicle::factory()->create(['plate' => 'XYZ-999']);
        Maintenance::factory()->create([
            'vehicle_id' => $vehicle->id,
            'type' => 'tech_visit',
            'next_due' => now()->subDays(2), // Past due
            'status' => 'pending'
        ]);

        Artisan::call('maintenance:check-alerts');
    }

    public function test_mileage_based_maintenance_alert()
    {
        Log::shouldReceive('channel')->with('single')->andReturnSelf();
        Log::shouldReceive('info')->withArgs(function ($message) {
            return str_contains($message, '[WARNING] Maintenance oil due at 10000 km');
        })->once();

        $vehicle = Vehicle::factory()->create(['plate' => 'OIL-000', 'mileage' => 9500]);
        Maintenance::factory()->create([
            'vehicle_id' => $vehicle->id,
            'type' => 'oil',
            'next_due_km' => 10000, // Within 1000 km
            'status' => 'pending'
        ]);

        Artisan::call('maintenance:check-alerts');
    }
}
