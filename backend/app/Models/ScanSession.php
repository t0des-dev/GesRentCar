<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ScanSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'status',
        'qr_token',
        'cin_name',
        'cin_number',
        'cin_image_url',
        'license_number',
        'license_image_url',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (ScanSession $session) {
            if (! $session->token) {
                $session->token = Str::random(64);
            }
            if (! $session->qr_token) {
                $session->qr_token = Str::random(32);
            }
        });
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'token' => $this->token,
            'status' => $this->status,
            'cin_name' => $this->cin_name,
            'cin_number' => $this->cin_number,
            'cin_image_url' => $this->cin_image_url,
            'license_number' => $this->license_number,
            'license_image_url' => $this->license_image_url,
            'expires_at' => $this->expires_at?->toIso8601String(),
        ];
    }
}
