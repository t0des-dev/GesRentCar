<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'content',
        'template',
        'status',
        'sort_order',
        'meta',
    ];

    protected $casts = [
        'content' => 'array',
        'meta' => 'array',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
