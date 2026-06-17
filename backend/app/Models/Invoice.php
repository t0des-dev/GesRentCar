<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'invoice_number',
        'subtotal_ht',
        'vat_rate',
        'vat_amount',
        'total_ttc',
        'deposit_amount',
        'remaining_amount',
        'status',
        'issued_at',
        'due_at',
        'paid_at',
    ];

    protected $casts = [
        'subtotal_ht' => 'decimal:2',
        'vat_rate' => 'decimal:2',
        'vat_amount' => 'decimal:2',
        'total_ttc' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'issued_at' => 'datetime',
        'due_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public static function generateNumber(): string
    {
        $year = now()->format('Y');
        $month = now()->format('m');
        $lastInvoice = static::whereYear('created_at', now()->year)
            ->orderByDesc('id')
            ->first();

        $sequence = $lastInvoice
            ? (int) substr($lastInvoice->invoice_number, -5) + 1
            : 1;

        return sprintf('FAC-%s%s-%05d', $year, $month, $sequence);
    }
}
