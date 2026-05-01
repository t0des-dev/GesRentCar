<?php

namespace App\Services\Payment;

class CmiGateway implements PaymentGatewayInterface
{
    public function charge(float $amount, array $options = []): array
    {
        // Mock CMI API call
        return [
            'success' => true,
            'transaction_id' => 'CMI_' . uniqid(),
            'amount' => $amount
        ];
    }

    public function refund(string $transactionId, float $amount): array
    {
        // Mock CMI API call
        return [
            'success' => true,
            'transaction_id' => 'REF_' . $transactionId,
            'amount' => $amount
        ];
    }
}
