<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'type',
        'description',
        'cost',
        'maintenance_date',
        'next_due',
        'next_due_km',
        'status',
    ];

    protected $casts = [
        'next_due' => 'date',
        'maintenance_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
