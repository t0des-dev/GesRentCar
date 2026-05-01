<?php

namespace App\Services\Payment;

interface PaymentGatewayInterface
{
    public function charge(float $amount, array $options = []): array;
    public function refund(string $transactionId, float $amount): array;
}
