<?php

namespace Tests\Unit;

use App\Models\Vehicle;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PricingService $pricingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->pricingService = new PricingService;
    }

    private function createVehicle(float $pricePerDay = 500, string $type = 'internal'): Vehicle
    {
        return Vehicle::factory()->create([
            'price_per_day' => $pricePerDay,
            'type' => $type,
        ]);
    }

    public function test_basic_pricing_without_options(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->calculateTotal($vehicle, 3, [], 0.5, Carbon::parse('2026-06-15'));

        $this->assertEquals(1500, $result['base_price']);
        $this->assertEquals(0, $result['options_price']);
        $this->assertEquals(1500, $result['total_price']);
    }

    public function test_flexibility_option(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->calculateTotal($vehicle, 3, ['flexibility' => 'flexible'], 0.5, Carbon::parse('2026-06-15'));

        $expectedOptions = 60 * 3; // 180 MAD
        $this->assertEquals($expectedOptions, $result['options_price']);
        $this->assertEquals(1500 + $expectedOptions, $result['total_price']);
    }

    public function test_unlimited_mileage_option(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->calculateTotal($vehicle, 2, ['mileage' => 'unlimited'], 0.5, Carbon::parse('2026-06-15'));

        $expectedOptions = 140 * 2; // 280 MAD
        $this->assertEquals($expectedOptions, $result['options_price']);
        $this->assertEquals(1000 + $expectedOptions, $result['total_price']);
    }

    public function test_both_options(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->calculateTotal($vehicle, 2, ['flexibility' => 'flexible', 'mileage' => 'unlimited'], 0.5, Carbon::parse('2026-06-15'));

        $expectedOptions = (60 * 2) + (140 * 2); // 400 MAD
        $this->assertEquals($expectedOptions, $result['options_price']);
        $this->assertEquals(1000 + $expectedOptions, $result['total_price']);
    }

    public function test_high_demand_multiplier(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->getDynamicRate($vehicle, 0.85, Carbon::parse('2026-06-15'));

        $this->assertEquals(600, $result['price']); // 500 * 1.20
        $this->assertEquals('Forte demande', $result['reason']);
        $this->assertEquals(1.20, $result['multiplier']);
    }

    public function test_low_demand_discount(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->getDynamicRate($vehicle, 0.20, Carbon::parse('2026-06-15'));

        $this->assertEquals(450, $result['price']); // 500 * 0.90
        $this->assertEquals('Offre spéciale', $result['reason']);
    }

    public function test_high_season_multiplier(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->getDynamicRate($vehicle, 0.5, Carbon::parse('2026-07-15'));

        $this->assertEquals(650, $result['price']); // 500 * 1.30
        $this->assertEquals('Haute saison', $result['reason']);
    }

    public function test_weekend_multiplier(): void
    {
        $vehicle = $this->createVehicle(500);
        // 2026-06-20 is a Saturday
        $result = $this->pricingService->getDynamicRate($vehicle, 0.5, Carbon::parse('2026-06-20'));

        $this->assertEquals(550, $result['price']); // 500 * 1.10
        $this->assertEquals('Tarif weekend', $result['reason']);
    }

    public function test_long_stay_14_days_discount(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->getDynamicRate($vehicle, 0.5, Carbon::parse('2026-06-15'), 14);

        $this->assertEquals(425, $result['price']); // 500 * 0.85
        $this->assertEquals('Tarif 2 semaines', $result['reason']);
    }

    public function test_long_stay_7_days_discount(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->getDynamicRate($vehicle, 0.5, Carbon::parse('2026-06-15'), 7);

        $this->assertEquals(450, $result['price']); // 500 * 0.90
        $this->assertEquals('Tarif semaine', $result['reason']);
    }

    public function test_no_options_returns_zero(): void
    {
        $optionsPrice = $this->pricingService->calculateOptionsPrice([], 5);
        $this->assertEquals(0, $optionsPrice);
    }

    public function test_single_day_minimum(): void
    {
        $vehicle = $this->createVehicle(500);
        $result = $this->pricingService->calculateTotal($vehicle, 0, [], 0.5, Carbon::parse('2026-06-15'));

        $this->assertEquals(500, $result['total_price']); // 1 day minimum
    }
}
