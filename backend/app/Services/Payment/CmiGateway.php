<?php

namespace App\Services\Payment;

class CmiGateway implements PaymentGatewayInterface
{
    protected $clientId;
    protected $storeKey;
    protected $baseUrl;
    protected $redirectUrl;
    protected $failUrl;

    public function __construct()
    {
        $this->clientId    = config('services.cmi.client_id');
        $this->storeKey    = config('services.cmi.store_key');
        $this->baseUrl     = config('services.cmi.base_url');
        $this->redirectUrl = config('services.cmi.redirect_url');
        $this->failUrl     = config('services.cmi.fail_url');
    }

    /**
     * Prepares the parameters for the CMI redirect form.
     */
    public function charge(float $amount, array $options = []): array
    {
        $reservationId = $options['reservation_id'] ?? '0';
        $email = $options['email'] ?? 'client@vectoria.ma';

        $params = [
            'clientid'      => $this->clientId,
            'amount'        => number_format($amount, 2, '.', ''),
            'okUrl'         => $this->redirectUrl,
            'failUrl'       => $this->failUrl,
            'TranType'      => 'PreAuth', // Pre-authorization for deposit
            'currency'      => '504', // MAD code
            'oid'           => $reservationId . '_' . time(),
            'email'         => $email,
            'storetype'     => '3D_PAY_HOSTING',
            'hashAlgorithm' => 'ver3',
            'rnd'           => microtime(),
            'shopurl'       => config('app.url'),
            'encoding'      => 'UTF-8',
        ];

        $params['HASH'] = $this->generateHash($params);

        return [
            'success'     => true,
            'transaction_id' => 'CMI_' . uniqid(),
            'action_url'  => $this->baseUrl,
            'params'      => $params,
            'method'      => 'POST'
        ];
    }

    public function refund(string $transactionId, float $amount): array
    {
        if (app()->environment('local', 'testing')) {
            return [
                'success' => true,
                'transaction_id' => 'REF_CMI_' . uniqid(),
                'message' => 'Simulated refund in local/testing environment.'
            ];
        }

        throw new \Exception('Refund via CMI must be processed manually in the CMI Merchant Portal.');
    }

    /**
     * Generates the CMI security hash based on parameters.
     */
    public function generateHash(array $params): string
    {
        ksort($params); // CMI requires alphabetical sorting
        
        $hashString = "";
        foreach ($params as $key => $value) {
            if ($key !== 'HASH' && $key !== 'encoding' && $key !== 'hashAlgorithm') {
                $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $value));
                $hashString .= $escapedValue . "|";
            }
        }
        
        $hashString .= str_replace("|", "\\|", str_replace("\\", "\\\\", $this->storeKey));
        
        return base64_encode(hash('sha512', $hashString, true));
    }
}
