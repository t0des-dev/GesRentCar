<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key', 'value', 'agency_slogan', 'agency_primary_color',
        'hero_image_url', 'about_text_fr', 'about_text_en', 'about_text_ar', 'sections_config',
        'category_prices', 'special_offers', 'header_config', 'footer_config', 'theme_config', 'stats_config',
        'sections_order', 'testimonials', 'seo_config', 'social_hub'
    ];

    protected $casts = [
        'sections_config' => 'array',
        'category_prices' => 'array',
        'special_offers' => 'array',
        'header_config' => 'array',
        'footer_config' => 'array',
        'theme_config' => 'array',
        'stats_config' => 'array',
        'sections_order' => 'array',
        'testimonials' => 'array',
        'seo_config' => 'array',
        'social_hub' => 'array'
    ];
}
