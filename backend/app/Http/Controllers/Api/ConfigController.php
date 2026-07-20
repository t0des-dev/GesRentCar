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
            'type' => 'required|string|in:logo,hero,favicon',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $type = $request->input('type');

            $filename = time().'_'.$type.'.'.$file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $filename, 'public');

            $url = '/storage/branding/'.$filename;

            // Persist URL to settings
            $setting = Setting::firstOrCreate(['key' => 'agency_config']);
            $field = match ($type) {
                'logo' => 'logo_url',
                'hero' => 'hero_image_url',
                'favicon' => 'favicon_url',
                default => null,
            };
            if ($field) {
                $setting->update([$field => $url]);
            }

            return response()->json([
                'url' => $url,
                'message' => 'Fichier téléchargé avec succès',
            ]);
        }

        return response()->json(['message' => 'Aucun fichier fourni'], 400);
    }

    public function index(): JsonResponse
    {
        try {
            $setting = Setting::where('key', 'agency_config')->first();
        } catch (\Throwable $e) {
            return response()->json([
                'agency_name' => env('AGENCY_NAME', 'Vectoria Rent Car'),
                'agency_slogan' => env('AGENCY_SLOGAN', 'Premium Car Rental'),
                'primary_color' => env('AGENCY_PRIMARY_COLOR', '#6366f1'),
            ]);
        }

        // If agency_config record doesn't exist, try to migrate from legacy records
        if (! $setting) {
            try {
                $name = Setting::where('key', 'agency_name')->value('value') ?? env('AGENCY_NAME', 'Vectoria Rent Car');
                $slogan = Setting::where('key', 'agency_slogan')->value('value') ?? env('AGENCY_SLOGAN', 'Premium Car Rental');
                $color = Setting::where('key', 'agency_primary_color')->value('value') ?? env('AGENCY_PRIMARY_COLOR', '#6366f1');
            } catch (\Throwable $e) {
                $name = env('AGENCY_NAME', 'Vectoria Rent Car');
                $slogan = env('AGENCY_SLOGAN', 'Premium Car Rental');
                $color = env('AGENCY_PRIMARY_COLOR', '#6366f1');
            }

            return response()->json([
                'agency_name' => $name,
                'agency_slogan' => $slogan,
                'primary_color' => $color,
                'sections_config' => null,
                'sections_order' => null,
            ]);
        }

        try {
            return response()->json([
                'agency_name' => $setting->value ?? env('AGENCY_NAME', 'Vectoria Rent Car'),
                'agency_slogan' => $setting->agency_slogan ?? env('AGENCY_SLOGAN', 'Premium Car Rental'),
                'primary_color' => $setting->agency_primary_color ?? env('AGENCY_PRIMARY_COLOR', '#6366f1'),
                'logo_url' => $setting->logo_url ?? null,
                'logo_config' => $setting->logo_config ?? null,
                'hero_image_url' => $setting->hero_image_url ?? null,
                'hero_video_url' => $setting->hero_video_url ?? null,
                'about_text_fr' => $setting->about_text_fr ?? null,
                'about_text_en' => $setting->about_text_en ?? null,
                'about_text_ar' => $setting->about_text_ar ?? null,
                'sections_config' => $setting->sections_config ?? null,
                'category_prices' => $setting->category_prices ?? null,
                'special_offers' => $setting->special_offers ?? null,
                'header_config' => $setting->header_config ?? null,
                'footer_config' => $setting->footer_config ?? null,
                'theme_config' => $setting->theme_config ?? null,
                'stats_config' => $setting->stats_config ?? null,
                'sections_order' => $setting->sections_order ?? null,
                'testimonials' => $setting->testimonials ?? null,
                'seo_config' => $setting->seo_config ?? null,
                'social_hub' => $setting->social_hub ?? null,
                'faq_config' => $setting->faq_config ?? null,
                'features_config' => $setting->features_config ?? null,
                'concierge_config' => $setting->concierge_config ?? null,
                'sections_content' => $setting->sections_content ?? null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'agency_name' => env('AGENCY_NAME', 'Vectoria Rent Car'),
                'agency_slogan' => env('AGENCY_SLOGAN', 'Premium Car Rental'),
                'primary_color' => env('AGENCY_PRIMARY_COLOR', '#6366f1'),
            ]);
        }
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'slogan' => 'sometimes|nullable|string|max:500',
            'primary_color' => 'sometimes|nullable|string|max:20',
            'logo_url' => 'sometimes|nullable|string|max:1000',
            'logo_config' => 'sometimes|nullable|array',
            'hero_image_url' => 'sometimes|nullable|string|max:1000',
            'hero_video_url' => 'sometimes|nullable|string|max:1000',
            'about_text_fr' => 'sometimes|nullable|string',
            'about_text_en' => 'sometimes|nullable|string',
            'about_text_ar' => 'sometimes|nullable|string',
            'sections_config' => 'sometimes|nullable|array',
            'category_prices' => 'sometimes|nullable|array',
            'special_offers' => 'sometimes|nullable|array',
            'header_config' => 'sometimes|nullable|array',
            'footer_config' => 'sometimes|nullable|array',
            'theme_config' => 'sometimes|nullable|array',
            'stats_config' => 'sometimes|nullable|array',
            'sections_order' => 'sometimes|nullable|array',
            'testimonials' => 'sometimes|nullable|array',
            'seo_config' => 'sometimes|nullable|array',
            'social_hub' => 'sometimes|nullable|array',
            'faq_config' => 'sometimes|nullable|array',
            'features_config' => 'sometimes|nullable|array',
            'concierge_config' => 'sometimes|nullable|array',
            'sections_content' => 'sometimes|nullable|array',
        ]);

        $data = $validated;

        $setting = Setting::firstOrCreate(['key' => 'agency_config']);

        if (isset($data['name'])) {
            $setting->value = $data['name'];
        }
        if (isset($data['slogan'])) {
            $setting->agency_slogan = $data['slogan'];
        }
        if (isset($data['primary_color'])) {
            $setting->agency_primary_color = $data['primary_color'];
        }
        if (isset($data['logo_url'])) {
            $setting->logo_url = $data['logo_url'];
        }
        if (isset($data['logo_config'])) {
            $setting->logo_config = $data['logo_config'];
        }
        if (isset($data['hero_image_url'])) {
            $setting->hero_image_url = $data['hero_image_url'];
        }
        if (isset($data['hero_video_url'])) {
            $setting->hero_video_url = $data['hero_video_url'];
        }
        if (isset($data['about_text_fr'])) {
            $setting->about_text_fr = $data['about_text_fr'];
        }
        if (isset($data['about_text_en'])) {
            $setting->about_text_en = $data['about_text_en'];
        }
        if (isset($data['about_text_ar'])) {
            $setting->about_text_ar = $data['about_text_ar'];
        }
        if (isset($data['sections_config'])) {
            $setting->sections_config = $data['sections_config'];
        }
        if (isset($data['category_prices'])) {
            $setting->category_prices = $data['category_prices'];
        }
        if (isset($data['special_offers'])) {
            $setting->special_offers = $data['special_offers'];
        }
        if (isset($data['header_config'])) {
            $setting->header_config = $data['header_config'];
        }
        if (isset($data['footer_config'])) {
            $setting->footer_config = $data['footer_config'];
        }
        if (isset($data['theme_config'])) {
            $setting->theme_config = $data['theme_config'];
        }
        if (isset($data['stats_config'])) {
            $setting->stats_config = $data['stats_config'];
        }

        // CMS & SEO
        if (isset($data['sections_order'])) {
            $setting->sections_order = $data['sections_order'];
        }
        if (isset($data['testimonials'])) {
            $setting->testimonials = $data['testimonials'];
        }
        if (isset($data['seo_config'])) {
            $setting->seo_config = $data['seo_config'];
        }
        if (isset($data['social_hub'])) {
            $setting->social_hub = $data['social_hub'];
        }
        if (isset($data['faq_config'])) {
            $setting->faq_config = $data['faq_config'];
        }
        if (isset($data['features_config'])) {
            $setting->features_config = $data['features_config'];
        }
        if (isset($data['concierge_config'])) {
            $setting->concierge_config = $data['concierge_config'];
        }
        if (isset($data['sections_content'])) {
            $setting->sections_content = $data['sections_content'];
        }

        $setting->save();

        return response()->json(['message' => 'Configuration sauvegardée avec succès']);
    }
}
