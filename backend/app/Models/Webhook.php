<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Webhook extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'url',
        'events',
        'secret',
        'is_active',
        'retry_count',
        'last_triggered_at',
        'failure_count',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'events' => 'array',
    ];
}
