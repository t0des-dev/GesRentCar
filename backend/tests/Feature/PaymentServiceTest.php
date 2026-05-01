<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\Payment\CmiGateway;
use App\Services\Payment\PaymentService;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PaymentService $paymentService;

    protected function setUp(): void
    {
        parent::setUp();
        // Using real CmiGateway here for sandbox test since it's mocked
        $this->paymentService = new PaymentService(new CmiGateway());
    }

    public function test_cmi_partial_payment_and_full_payment()
    {
        $vehicle = Vehicle::factory()->create();
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 1000,
            'status' => 'pending_payment'
        ]);

        // Partial payment 400
        $payment1 = $this->paymentService->processPayment($reservation, 400, 'cmi');
        
        $this->assertEquals(400, $payment1->paid_amount);
        $this->assertEquals(600, $payment1->remaining);
        $this->assertEquals('partial', $payment1->status);
        $this->assertEquals('cmi', $payment1->payment_method);
        $this->assertStringStartsWith('CMI_', $payment1->transaction_id);
        $this->assertEquals('pending_payment', $reservation->fresh()->status);

        // Remaining full payment 600
        $payment2 = $this->paymentService->processPayment($reservation, 600, 'cmi');

        $this->assertEquals(600, $payment2->paid_amount);
        $this->assertEquals(0, $payment2->remaining);
        $this->assertEquals('full', $payment2->status);
        $this->assertEquals('confirmed', $reservation->fresh()->status);
    }

    public function test_cannot_pay_more_than_total()
    {
        $vehicle = Vehicle::factory()->create();
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 1000,
        ]);

        $this->expectException(Exception::class);
        $this->paymentService->processPayment($reservation, 1500, 'cash');
    }

    public function test_refund_process()
    {
        $vehicle = Vehicle::factory()->create();
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 1000,
        ]);

        $payment = $this->paymentService->processPayment($reservation, 1000, 'cmi');

        // Refund 200
        $refund = $this->paymentService->processRefund($payment, 200);

        $this->assertEquals(-200, $refund->paid_amount);
        $this->assertEquals('refunded', $refund->status);
        $this->assertEquals('refund', $refund->type);
        $this->assertStringStartsWith('REF_CMI_', $refund->transaction_id);
    }

    public function test_hold_deposit()
    {
        $vehicle = Vehicle::factory()->create();
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'deposit_amount' => 500,
        ]);

        $deposit = $this->paymentService->holdDeposit($reservation, 'cmi');

        $this->assertEquals(500, $deposit->paid_amount);
        $this->assertEquals('deposit', $deposit->type);
        $this->assertNotNull($deposit->transaction_id);
    }
}
