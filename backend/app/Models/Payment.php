<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'reservation_id',
        'paid_amount',
        'remaining',
        'status',
        'payment_method',
        'type',
        'transaction_id',
    ];

    protected $casts = [
        'paid_amount' => 'decimal:2',
        'remaining' => 'decimal:2',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
