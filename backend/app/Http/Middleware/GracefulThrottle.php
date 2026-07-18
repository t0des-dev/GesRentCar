<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Redis\Connections\ConnectionException;
use Symfony\Component\HttpFoundation\Response;

class GracefulThrottle
{
    public function handle(Request $request, Closure $next, ...$arguments): Response
    {
        try {
            return app('Illuminate\Routing\Middleware\ThrottleRequests')
                ->handle($request, $next, ...$arguments);
        } catch (ConnectionException $e) {
            // Redis down — skip rate limiting, continue request
            return $next($request);
        }
    }
}
