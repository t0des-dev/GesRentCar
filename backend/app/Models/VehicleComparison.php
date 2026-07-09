<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleComparison extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_ids',
        'session_id',
    ];

    protected $casts = [
        'vehicle_ids' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
