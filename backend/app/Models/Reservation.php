<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'status',
        'total_price',
        'deposit_amount',
        'documents',
        'payment_method',
        'signature',
        'options',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'documents' => 'array',
            'total_price' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'options' => 'array',
        ];
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }

    /**
     * Check if the reservation has timed out.
     * - pending_partner: cancelled after 1 hour
     * - pending_payment: cancelled after 30 minutes (abandoned Stripe/CMI)
     */
    public function checkTimeout(): bool
    {
        if ($this->status === 'pending_partner' && $this->created_at->addHour()->isPast()) {
            $this->cancel('partner_timeout');

            return true;
        }

        if ($this->status === 'pending_payment' && $this->created_at->addMinutes(30)->isPast()) {
            $this->cancel('payment_timeout');

            return true;
        }

        return false;
    }

    public function acceptPartner()
    {
        if ($this->status !== 'pending_partner') {
            throw new \Exception('Cannot accept partner validation. Current status: '.$this->status);
        }

        $this->update(['status' => 'pending_payment']);
        // Here we could dispatch an event to notify the client
    }

    public function refusePartner()
    {
        if ($this->status !== 'pending_partner') {
            throw new \Exception('Cannot refuse partner validation. Current status: '.$this->status);
        }

        $this->cancel('partner_refused');
    }

    public function cancel(string $reason = 'user_cancelled')
    {
        $this->update([
            'status' => 'cancelled',
            // Ideally we could log the reason in a separate field or activity log
        ]);
    }
}
