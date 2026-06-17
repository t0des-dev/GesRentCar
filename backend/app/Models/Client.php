<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Client extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'cin',
        'license_number',
        'cin_image_url',
        'license_image_url',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
