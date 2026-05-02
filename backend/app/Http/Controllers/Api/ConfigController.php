<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    /**
     * Upload an asset (logo, hero image, etc.) for the storefront branding.
     */
    public function uploadAsset(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|max:5120', // Max 5MB
            'type' => 'required|string|in:logo,hero,favicon'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $type = $request->input('type');
            
            $filename = time() . '_' . $type . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('public/branding', $filename);
            
            $url = asset('storage/branding/' . $filename);

            return response()->json([
                'url' => $url,
                'message' => 'Fichier téléchargé avec succès'
            ]);
        }

        return response()->json(['message' => 'Aucun fichier fourni'], 400);
    }

    public function index(): JsonResponse
    {
        $setting = Setting::first();

        return response()->json([
            'agency_name' => $setting->value ?? env('AGENCY_NAME', 'Vectoria Rent Car'),
            'agency_slogan' => $setting->agency_slogan ?? env('AGENCY_SLOGAN', 'Premium Car Rental'),
            'primary_color' => $setting->agency_primary_color ?? env('AGENCY_PRIMARY_COLOR', '#6366f1'),
            'hero_image_url' => $setting->hero_image_url,
            'about_text_fr' => $setting->about_text_fr,
            'about_text_en' => $setting->about_text_en,
            'about_text_ar' => $setting->about_text_ar,
            'sections_config' => $setting->sections_config,
            'category_prices' => $setting->category_prices,
            'special_offers' => $setting->special_offers,
            'header_config' => $setting->header_config,
            'footer_config' => $setting->footer_config,
            'theme_config' => $setting->theme_config,
            'stats_config' => $setting->stats_config,
            'sections_order' => $setting->sections_order,
            'testimonials' => $setting->testimonials,
            'seo_config' => $setting->seo_config,
            'social_hub' => $setting->social_hub,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        
        $setting = Setting::first() ?: new Setting();
        
        if (isset($data['name'])) $setting->value = $data['name'];
        if (isset($data['slogan'])) $setting->agency_slogan = $data['slogan'];
        if (isset($data['primary_color'])) $setting->agency_primary_color = $data['primary_color'];
        if (isset($data['hero_image_url'])) $setting->hero_image_url = $data['hero_image_url'];
        if (isset($data['about_text_fr'])) $setting->about_text_fr = $data['about_text_fr'];
        if (isset($data['about_text_en'])) $setting->about_text_en = $data['about_text_en'];
        if (isset($data['about_text_ar'])) $setting->about_text_ar = $data['about_text_ar'];
        if (isset($data['sections_config'])) $setting->sections_config = $data['sections_config'];
        if (isset($data['category_prices'])) $setting->category_prices = $data['category_prices'];
        if (isset($data['special_offers'])) $setting->special_offers = $data['special_offers'];
        if (isset($data['header_config'])) $setting->header_config = $data['header_config'];
        if (isset($data['footer_config'])) $setting->footer_config = $data['footer_config'];
        if (isset($data['theme_config'])) $setting->theme_config = $data['theme_config'];
        if (isset($data['stats_config'])) $setting->stats_config = $data['stats_config'];
        
        // CMS & SEO
        if (isset($data['sections_order'])) $setting->sections_order = $data['sections_order'];
        if (isset($data['testimonials'])) $setting->testimonials = $data['testimonials'];
        if (isset($data['seo_config'])) $setting->seo_config = $data['seo_config'];
        if (isset($data['social_hub'])) $setting->social_hub = $data['social_hub'];
        
        $setting->save();

        return response()->json(['message' => 'Configuration sauvegardée avec succès']);
    }
}
