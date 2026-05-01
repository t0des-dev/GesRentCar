<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehiclePolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_vehicle()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        $this->assertTrue($admin->can('create', Vehicle::class));
    }

    public function test_agent_cannot_create_vehicle()
    {
        $agent = User::factory()->create(['role' => 'agent']);
        
        $this->assertFalse($agent->can('create', Vehicle::class));
    }

    public function test_agent_can_update_own_vehicle()
    {
        $agent = User::factory()->create(['role' => 'agent']);
        $vehicle = Vehicle::factory()->create(['agent_id' => $agent->id]);

        $this->assertTrue($agent->can('update', $vehicle));
    }

    public function test_agent_cannot_update_others_vehicle()
    {
        $agent = User::factory()->create(['role' => 'agent']);
        $otherAgent = User::factory()->create(['role' => 'agent']);
        $vehicle = Vehicle::factory()->create(['agent_id' => $otherAgent->id]);

        $this->assertFalse($agent->can('update', $vehicle));
    }
}
