<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLoyaltyProfile extends Model
{
    use HasFactory;

    protected $table = 'user_loyalty_profiles';

    protected $fillable = [
        'user_id',
        'total_points',
        'available_points',
        'tier',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
