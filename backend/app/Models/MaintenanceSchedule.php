<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'title',
        'description',
        'type',
        'scheduled_date',
        'completed_date',
        'status',
        'estimated_cost',
        'actual_cost',
        'mileage_at_service',
        'recurring',
        'recurring_interval_days',
        'assigned_to',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
