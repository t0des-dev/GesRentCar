<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DisableServiceWorker
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->is('filament-admin/*') || $request->is('filament-admin')) {
            $response->headers->set('Clear-Site-Data', '"serviceWorkers"');
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        return $response;
    }
}
