<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VehicleCRUDTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_vehicle_with_photos()
    {
        Storage::fake('public');
        
        $admin = User::factory()->create(['role' => 'admin']);
        
        $payload = [
            'brand' => 'Peugeot',
            'model' => '308',
            'plate' => '12345-A-1',
            'price_per_day' => 300.00,
            'mileage' => 15000,
            'status' => 'available',
            'type' => 'internal',
            'photos' => [
                'photos/test_front.jpg',
                'photos/test_back.jpg'
            ]
        ];

        // Simulate API call or direct model creation since no controller exists yet
        $vehicle = Vehicle::create($payload);
        
        $this->assertDatabaseHas('vehicles', [
            'plate' => '12345-A-1',
            'mileage' => 15000,
        ]);
        
        $this->assertIsArray($vehicle->photos);
        $this->assertCount(2, $vehicle->photos);
    }

    public function test_cannot_create_vehicle_with_duplicate_plate()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        Vehicle::factory()->create(['plate' => '99999-B-2']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        Vehicle::create([
            'brand' => 'Dacia',
            'model' => 'Logan',
            'plate' => '99999-B-2', // Duplicate
            'price_per_day' => 200.00,
        ]);
    }
}
