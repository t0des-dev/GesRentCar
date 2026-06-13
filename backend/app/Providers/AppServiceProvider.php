<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
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
    }
}
