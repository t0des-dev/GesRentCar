<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\ContractService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ContractServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_generates_pdf_contract()
    {
        Storage::fake('public');
        
        $client = Client::factory()->create();
        $vehicle = Vehicle::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'vehicle_id' => $vehicle->id,
        ]);

        $service = new ContractService();
        $contract = $service->generateContract($reservation);

        $this->assertNotNull($contract->file_path);
        Storage::disk('public')->assertExists($contract->file_path);
    }

    public function test_electronic_signature_updates_contract_and_triggers_notifications()
    {
        Storage::fake('public');
        Log::shouldReceive('info')->twice(); // 1 for Whatsapp, 1 for Email

        $client = Client::factory()->create(['email' => 'client@test.com', 'phone' => '+212600000000']);
        $vehicle = Vehicle::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'vehicle_id' => $vehicle->id,
        ]);

        $service = new ContractService();
        $contract = $service->generateContract($reservation);

        $base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        
        $signedContract = $service->signContract($contract, $base64Image);

        $this->assertNotNull($signedContract->signed_at);
        $this->assertEquals($base64Image, $signedContract->signature_data);
    }
}
