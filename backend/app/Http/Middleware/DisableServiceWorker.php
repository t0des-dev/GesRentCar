<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DisableServiceWorker
{
    private string $swScript = <<<'HTML'
<script>
if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(reg){reg.unregister()})})}
</script>
HTML;

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->is('filament-admin*')) {
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');

            $content = $response->getContent();
            if ($content && str_contains($content, '</head>')) {
                $content = str_replace('</head>', $this->swScript . "\n</head>", $content);
                $response->setContent($content);
            }
        }

        return $response;
    }
}
