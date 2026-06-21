<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConciergeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_recommend_vehicles_via_concierge_chat()
    {
        // Create an available Mercedes for business
        Vehicle::factory()->create([
            'brand' => 'Mercedes',
            'model' => 'Classe S',
            'status' => 'available',
            'price_per_day' => 1500,
            'type' => 'internal',
        ]);

        // Create a Range Rover for adventure
        Vehicle::factory()->create([
            'brand' => 'Jeep',
            'model' => 'Wrangler',
            'status' => 'available',
            'price_per_day' => 800,
            'type' => 'internal',
        ]);

        // Call the concierge API asking for business
        $response = $this->postJson('/api/v1/concierge/chat', [
            'message' => 'Je cherche une voiture pour mes rendez-vous d\'affaires.',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'reply',
            'vibe',
            'suggestions' => [
                '*' => ['id', 'brand', 'model', 'price_per_day', 'image_url']
            ]
        ]);

        $this->assertTrue($response['success']);
        $this->assertStringContainsString('Business Elite', $response['vibe']);
        $this->assertStringContainsString('Mercedes', $response['reply']);
    }
}
