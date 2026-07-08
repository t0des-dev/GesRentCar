<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key', 'value', 'agency_slogan', 'agency_primary_color', 'logo_url', 'logo_config',
        'hero_image_url', 'hero_video_url', 'about_text_fr', 'about_text_en', 'about_text_ar', 'sections_config',
        'category_prices', 'special_offers', 'header_config', 'footer_config', 'theme_config', 'stats_config',
        'sections_order', 'testimonials', 'seo_config', 'social_hub', 'faq_config', 'features_config', 'concierge_config', 'sections_content',
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
        'social_hub' => 'array',
        'faq_config' => 'array',
        'features_config' => 'array',
        'concierge_config' => 'array',
        'sections_content' => 'array',
        'logo_config' => 'array',
    ];
}
