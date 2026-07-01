<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'brand',
        'model',
        'plate',
        'price_per_day',
        'mileage',
        'status',
        'agent_id',
        'type',
        'category',
        'transmission',
        'fuel_type',
        'horsepower',
        'year',
        'color',
        'seats',
        'image_url',
        'photos',
        'commission_rate',
        'description_fr',
        'description_en',
        'description_ar',
        'insurance_date',
        'tech_inspection_date',
        'vignette_date',
        'seo_title',
        'seo_description',
        'og_image_url',
    ];

    protected function casts(): array
    {
        return [
            'photos' => 'array',
            'price_per_day' => 'decimal:2',
            'insurance_date' => 'date',
            'tech_inspection_date' => 'date',
            'vignette_date' => 'date',
        ];
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    /**
     * Scope to filter available vehicles for a given date range.
     */
    public function scopeAvailable($query, $start, $end)
    {
        return $query->whereDoesntHave('reservations', function ($q) use ($start, $end) {
            $q->whereIn('status', ['pending', 'pending_payment', 'pending_partner', 'confirmed', 'ongoing'])
                ->where(function ($query) use ($start, $end) {
                    $query->whereBetween('start_date', [$start, $end])
                        ->orWhereBetween('end_date', [$start, $end])
                        ->orWhere(function ($query) use ($start, $end) {
                            $query->where('start_date', '<=', $start)
                                ->where('end_date', '>=', $end);
                        });
                });
        });
    }

    /**
     * Check if the vehicle is available for a given date range.
     */
    public function isAvailable($start, $end): bool
    {
        return ! $this->reservations()
            ->whereIn('status', ['pending', 'pending_payment', 'pending_partner', 'confirmed', 'ongoing'])
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_date', [$start, $end])
                    ->orWhereBetween('end_date', [$start, $end])
                    ->orWhere(function ($query) use ($start, $end) {
                        $query->where('start_date', '<=', $start)
                            ->where('end_date', '>=', $end);
                    });
            })->exists();
    }
}
