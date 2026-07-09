<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'webhook_id',
        'event',
        'payload',
        'status_code',
        'response_body',
        'success',
    ];

    protected $casts = [
        'success' => 'boolean',
        'payload' => 'array',
    ];

    public function webhook()
    {
        return $this->belongsTo(Webhook::class);
    }
}
