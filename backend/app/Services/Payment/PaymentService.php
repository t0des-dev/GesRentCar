<?php

namespace App\Services\Payment;

use App\Models\Payment;
use App\Models\Reservation;
use Exception;

class PaymentService
{
    protected PaymentGatewayInterface $gateway;

    public function __construct(PaymentGatewayInterface $gateway)
    {
        $this->gateway = $gateway;
    }

    public function processPayment(Reservation $reservation, float $amount, string $method = 'cash'): Payment
    {
        if ($amount > $reservation->total_price) {
            throw new Exception("Payment amount exceeds total price.");
        }

        $transactionId = null;

        if ($method === 'cmi') {
            $result = $this->gateway->charge($amount, ['reservation_id' => $reservation->id]);
            if (!$result['success']) {
                throw new Exception("CMI Payment failed.");
            }
            $transactionId = $result['transaction_id'];
        }

        // Calculate remaining
        $alreadyPaid = Payment::where('reservation_id', $reservation->id)
            ->where('type', 'payment')
            ->sum('paid_amount');
            
        $remaining = $reservation->total_price - ($alreadyPaid + $amount);
        $status = $remaining <= 0 ? 'full' : 'partial';

        $payment = Payment::create([
            'reservation_id' => $reservation->id,
            'paid_amount' => $amount,
            'remaining' => $remaining,
            'status' => $status,
            'payment_method' => $method,
            'type' => 'payment',
            'transaction_id' => $transactionId,
        ]);

        if ($status === 'full' && $reservation->status === 'pending_payment') {
            $reservation->update(['status' => 'confirmed']);
        }

        return $payment;
    }

    public function holdDeposit(Reservation $reservation, string $method = 'cmi'): Payment
    {
        $transactionId = null;
        if ($method === 'cmi') {
            // Usually deposit is pre-auth, here we mock it
            $result = $this->gateway->charge($reservation->deposit_amount, ['pre_auth' => true]);
            $transactionId = $result['transaction_id'];
        }

        return Payment::create([
            'reservation_id' => $reservation->id,
            'paid_amount' => $reservation->deposit_amount,
            'remaining' => 0,
            'status' => 'full',
            'payment_method' => $method,
            'type' => 'deposit',
            'transaction_id' => $transactionId,
        ]);
    }

    public function processRefund(Payment $payment, float $amount): Payment
    {
        if ($amount > $payment->paid_amount) {
            throw new Exception("Refund cannot exceed original payment amount.");
        }

        $transactionId = null;
        if ($payment->payment_method === 'cmi') {
            $result = $this->gateway->refund($payment->transaction_id, $amount);
            $transactionId = $result['transaction_id'];
        }

        return Payment::create([
            'reservation_id' => $payment->reservation_id,
            'paid_amount' => -$amount,
            'remaining' => $payment->remaining + $amount,
            'status' => 'refunded',
            'payment_method' => $payment->payment_method,
            'type' => 'refund',
            'transaction_id' => $transactionId,
        ]);
    }
}
