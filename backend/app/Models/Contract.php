<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'reservation_id',
        'file_path',
        'signed_at',
        'signature_data',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
