<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\StripeController;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\NotificationService;
use App\Services\PricingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected string $webhookSecret = 'whsec_test_secret';

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.stripe.webhook_secret', $this->webhookSecret);
        Config::set('services.stripe.secret', 'sk_test_fake');
        Stripe::setApiKey('sk_test_fake');
    }

    private function buildStripeSignature(string $payload): string
    {
        $timestamp = time();
        $signedPayload = "{$timestamp}.{$payload}";
        $signature = hash_hmac('sha256', $signedPayload, $this->webhookSecret);

        return "t={$timestamp},v1={$signature}";
    }

    public function test_webhook_confirms_reservation_on_payment_succeeded(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 1000,
            'status' => 'pending_payment',
        ]);

        $intent = PaymentIntent::constructFrom([
            'id' => 'pi_test_123',
            'amount' => 100000, // 1000 MAD in centimes
            'status' => 'succeeded',
            'metadata' => ['reservation_id' => $reservation->id],
        ]);

        $controller = new StripeController(
            new NotificationService,
            new PricingService
        );

        // Simulate webhook via route
        $payload = json_encode([
            'type' => 'payment_intent.succeeded',
            'data' => ['object' => [
                'id' => 'pi_test_123',
                'amount' => 100000,
                'status' => 'succeeded',
                'metadata' => ['reservation_id' => $reservation->id],
            ]],
        ]);

        $response = $this->postJson('/api/v1/stripe/webhook', json_decode($payload, true), [
            'Stripe-Signature' => $this->buildStripeSignature($payload),
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('payments', [
            'reservation_id' => $reservation->id,
            'paid_amount' => 1000,
            'status' => 'full',
        ]);
        $this->assertEquals('confirmed', $reservation->fresh()->status);
    }

    public function test_webhook_cancels_reservation_on_payment_failed(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 1000,
            'status' => 'pending_payment',
        ]);

        $payload = json_encode([
            'type' => 'payment_intent.payment_failed',
            'data' => ['object' => [
                'id' => 'pi_test_456',
                'amount' => 100000,
                'status' => 'failed',
                'metadata' => ['reservation_id' => $reservation->id],
            ]],
        ]);

        $response = $this->postJson('/api/v1/stripe/webhook', json_decode($payload, true), [
            'Stripe-Signature' => $this->buildStripeSignature($payload),
        ]);

        $response->assertOk();
        $this->assertEquals('cancelled', $reservation->fresh()->status);
    }

    public function test_webhook_is_idempotent_for_already_confirmed(): void
    {
        $vehicle = Vehicle::factory()->create(['status' => 'available']);
        $reservation = Reservation::factory()->create([
            'vehicle_id' => $vehicle->id,
            'total_price' => 1000,
            'status' => 'confirmed',
        ]);

        $payload = json_encode([
            'type' => 'payment_intent.succeeded',
            'data' => ['object' => [
                'id' => 'pi_test_789',
                'amount' => 100000,
                'status' => 'succeeded',
                'metadata' => ['reservation_id' => $reservation->id],
            ]],
        ]);

        $response = $this->postJson('/api/v1/stripe/webhook', json_decode($payload, true), [
            'Stripe-Signature' => $this->buildStripeSignature($payload),
        ]);

        $response->assertOk();
        // No new payment should be created
        $this->assertCount(0, Payment::where('reservation_id', $reservation->id)->get());
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $payload = json_encode([
            'type' => 'payment_intent.succeeded',
            'data' => ['object' => [
                'id' => 'pi_test_bad',
                'amount' => 100000,
                'status' => 'succeeded',
                'metadata' => ['reservation_id' => 999],
            ]],
        ]);

        $response = $this->postJson('/api/v1/stripe/webhook', json_decode($payload, true), [
            'Stripe-Signature' => 'invalid_signature',
        ]);

        $response->assertStatus(400);
    }

    public function test_webhook_ignores_missing_reservation_id(): void
    {
        $payload = json_encode([
            'type' => 'payment_intent.succeeded',
            'data' => ['object' => [
                'id' => 'pi_test_nometa',
                'amount' => 100000,
                'status' => 'succeeded',
                'metadata' => [],
            ]],
        ]);

        $response = $this->postJson('/api/v1/stripe/webhook', json_decode($payload, true), [
            'Stripe-Signature' => $this->buildStripeSignature($payload),
        ]);

        $response->assertOk();
        // Should not crash — just log warning and return
    }

    public function test_webhook_handles_unknown_event_type(): void
    {
        $payload = json_encode([
            'type' => 'customer.created',
            'data' => ['object' => ['id' => 'cus_123']],
        ]);

        $response = $this->postJson('/api/v1/stripe/webhook', json_decode($payload, true), [
            'Stripe-Signature' => $this->buildStripeSignature($payload),
        ]);

        $response->assertOk();
    }
}
