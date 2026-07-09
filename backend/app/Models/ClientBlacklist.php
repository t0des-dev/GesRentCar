<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientBlacklist extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'email',
        'phone',
        'cin',
        'reason',
        'notes',
        'blocked_by',
    ];

    public function blockedBy()
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }
}
