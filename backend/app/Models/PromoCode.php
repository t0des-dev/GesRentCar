<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    protected $fillable = ['code', 'type', 'value', 'max_uses', 'used_count', 'expires_at', 'active'];

    protected function casts(): array
    {
        return ['expires_at' => 'date', 'value' => 'decimal:2'];
    }

    public function isValid(): bool
    {
        if (! $this->active) {
            return false;
        }
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }
        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }
}
