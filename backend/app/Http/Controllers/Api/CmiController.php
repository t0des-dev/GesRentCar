<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Services\NotificationService;
use App\Services\Payment\CmiGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CmiController extends Controller
{
    protected $gateway;

    protected $notifications;

    public function __construct(CmiGateway $gateway, NotificationService $notifications)
    {
        $this->gateway = $gateway;
        $this->notifications = $notifications;
    }

    /**
     * Handle the response from CMI (Redirected by user's browser)
     */
    public function callback(Request $request)
    {
        Log::info('CMI Callback received', $request->all());

        // Validate Hash from CMI
        $params = $request->except(['HASH']);
        $calculatedHash = $this->gateway->generateHash($params);

        if ($request->input('HASH') !== $calculatedHash) {
            Log::error('CMI Hash mismatch', [
                'received' => $request->input('HASH'),
                'calculated' => $calculatedHash,
            ]);

            return redirect(config('services.cmi.fail_url').'?error=hash_mismatch');
        }

        $procReturnCode = $request->input('ProcReturnCode');
        $oid = $request->input('oid'); // Format: reservationId_timestamp
        $reservationId = explode('_', $oid)[0];
        $reservation = Reservation::findOrFail($reservationId);

        if ($procReturnCode === '00') {
            // Payment Success
            $reservation->update(['status' => 'confirmed']);

            Payment::create([
                'reservation_id' => $reservation->id,
                'paid_amount' => $request->input('amount'),
                'remaining' => $reservation->total_price - $request->input('amount'),
                'status' => 'full',
                'payment_method' => 'cmi',
                'transaction_id' => $request->input('TransId'),
                'type' => 'deposit',
            ]);

            // Notify
            $this->notifications->notifyDepositPaid($reservation->load(['client', 'vehicle', 'contract']));

            return redirect(config('services.cmi.redirect_url')."?reservation_id={$reservationId}&status=success");
        }

        // Payment Failed
        return redirect(config('services.cmi.fail_url')."?reservation_id={$reservationId}&error=payment_rejected&code={$procReturnCode}");
    }

    /**
     * Initialize CMI Payment (Get form parameters)
     */
    public function init(Reservation $reservation)
    {
        $client = $reservation->client;

        $result = $this->gateway->charge($reservation->deposit_amount, [
            'reservation_id' => $reservation->id,
            'email' => $client->email,
        ]);

        return response()->json($result);
    }
}
