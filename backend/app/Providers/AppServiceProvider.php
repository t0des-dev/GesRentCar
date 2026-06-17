<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ─── Laravel 12 Best Practices ─────────────────────────────────────────
        // Détecte les requêtes N+1 (lazy loading) en mode local uniquement.
        // On n'utilise pas shouldBeStrict() complet car certains attributs du
        // modèle Setting sont des colonnes ajoutées progressivement et peuvent
        // être null sur des enregistrements anciens — ce qui provoquerait des
        // exceptions inutiles.
        Model::preventLazyLoading(! app()->isProduction());

        // Force HTTPS en production (derrière un reverse proxy nginx/Vercel)
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }

        // ─── Rate Limiting ─────────────────────────────────────────────────────
        // Global API limit: 60 requests per minute per IP
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

        // Auth endpoints: 5 attempts per minute (anti brute-force)
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Public endpoints: 30 requests per minute per IP
        RateLimiter::for('public', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });

        // Payment endpoints: 10 requests per minute per IP
        RateLimiter::for('payment', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
