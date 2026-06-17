<?php

namespace Tests\Unit;

use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\InvoiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceServiceTest extends TestCase
{
    use RefreshDatabase;

    protected InvoiceService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InvoiceService;
    }

    private function createReservation(float $totalPrice, ?float $paidAmount = null): Reservation
    {
        $vehicle = Vehicle::factory()->create();
        $client = Client::factory()->create();

        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'client_id' => $client->id,
            'total_price' => $totalPrice,
            'deposit_amount' => $totalPrice * 0.10,
        ]);

        if ($paidAmount !== null) {
            Payment::factory()->create([
                'reservation_id' => $reservation->id,
                'paid_amount' => $paidAmount,
                'status' => 'completed',
            ]);
        }

        return $reservation;
    }

    public function test_generate_invoice_creates_invoice(): void
    {
        $reservation = $this->createReservation(1200.00);

        $invoice = $this->service->generateInvoice($reservation);

        $this->assertNotNull($invoice);
        $this->assertEquals($reservation->id, $invoice->reservation_id);
        $this->assertMatchesRegularExpression('/^FAC-\d{6}-\d{5}$/', $invoice->invoice_number);
        $this->assertEquals('issued', $invoice->status);
    }

    public function test_generate_invoice_calculates_vat_correctly(): void
    {
        $reservation = $this->createReservation(1200.00);

        $invoice = $this->service->generateInvoice($reservation);

        $expectedHT = round(1200.00 / 1.20, 2); // 1000.00
        $expectedVAT = round(1200.00 - $expectedHT, 2); // 200.00

        $this->assertEquals($expectedHT, $invoice->subtotal_ht);
        $this->assertEquals(20.0, $invoice->vat_rate);
        $this->assertEquals($expectedVAT, $invoice->vat_amount);
        $this->assertEquals(1200.00, $invoice->total_ttc);
    }

    public function test_generate_invoice_is_idempotent(): void
    {
        $reservation = $this->createReservation(1200.00);

        $invoice1 = $this->service->generateInvoice($reservation);
        $invoice2 = $this->service->generateInvoice($reservation);

        $this->assertEquals($invoice1->id, $invoice2->id);
    }

    public function test_generate_invoice_marks_paid_when_fully_paid(): void
    {
        $reservation = $this->createReservation(1200.00, 1200.00);

        $invoice = $this->service->generateInvoice($reservation);

        $this->assertEquals('paid', $invoice->status);
        $this->assertNotNull($invoice->paid_at);
        $this->assertEquals(0, $invoice->remaining_amount);
    }

    public function test_generate_invoice_calculates_remaining(): void
    {
        $reservation = $this->createReservation(1200.00, 500.00);

        $invoice = $this->service->generateInvoice($reservation);

        $this->assertEquals('issued', $invoice->status);
        $this->assertEquals(700.00, $invoice->remaining_amount);
    }

    public function test_mark_as_paid(): void
    {
        $reservation = $this->createReservation(1200.00);
        $invoice = $this->service->generateInvoice($reservation);

        $result = $this->service->markAsPaid($invoice);

        $this->assertEquals('paid', $result->status);
        $this->assertNotNull($result->paid_at);
        $this->assertEquals(0, $result->remaining_amount);
    }

    public function test_invoice_number_is_sequential(): void
    {
        $r1 = $this->createReservation(1000.00);
        $r2 = $this->createReservation(2000.00);

        $inv1 = $this->service->generateInvoice($r1);
        $inv2 = $this->service->generateInvoice($r2);

        // Numbers should be sequential within the same month
        $num1 = (int) substr($inv1->invoice_number, -5);
        $num2 = (int) substr($inv2->invoice_number, -5);
        $this->assertEquals($num1 + 1, $num2);
    }
}
