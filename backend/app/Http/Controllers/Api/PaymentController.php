<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'amount' => 'required|numeric|min:0',
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);
        
        return DB::transaction(function () use ($reservation, $validated) {
            $existingPayment = $reservation->payment;
            
            if ($existingPayment) {
                $newPaid = $existingPayment->paid_amount + $validated['amount'];
                $newRemaining = $reservation->total_price - $newPaid;
                
                $existingPayment->update([
                    'paid_amount' => $newPaid,
                    'remaining' => max(0, $newRemaining),
                    'status' => $newRemaining <= 0 ? 'full' : 'partial'
                ]);
                
                $payment = $existingPayment;
            } else {
                $remaining = $reservation->total_price - $validated['amount'];
                
                $payment = Payment::create([
                    'reservation_id' => $reservation->id,
                    'paid_amount' => $validated['amount'],
                    'remaining' => max(0, $remaining),
                    'status' => $remaining <= 0 ? 'full' : 'partial'
                ]);
            }

            // Update reservation status if payment is made
            if ($reservation->status === 'attente_paiement' || $reservation->status === 'pending') {
                $reservation->update(['status' => 'confirmed']);
            }

            return response()->json($payment, 201);
        });
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load('reservation'));
    }
}
