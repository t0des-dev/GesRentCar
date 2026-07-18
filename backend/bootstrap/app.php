<?php

use App\Http\Middleware\AuditMiddleware;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
            'audit' => AuditMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function ($request, $e) {
            if ($request->is('api/*')) {
                return true;
            }

            return $request->expectsJson();
        });

        // Catch infrastructure failures and return clean JSON instead of 500 with stack trace.
        // IMPORTANT: Only return 503 for genuine service outages — NOT for throttling/cache misses
        // which should be non-blocking (skip rate limiting, continue without cache).
        $exceptions->renderable(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $message = class_basename(get_class($e)).': '.$e->getMessage();

            // Throttling/cache failures — let the request through (skip rate limiting)
            if ($e instanceof \Predis\PredisConnectionException
                || $e instanceof \Illuminate\Redis\Connections\ConnectionException
                || $e instanceof \Symfony\Component\Cache\Exception\TransportExceptionInterface
            ) {
                return null; // Let Laravel continue without rate limiting / cache
            }

            // Database down — only catch genuine connection failures, not "table not found"
            if ($e instanceof \PDOException && str_contains($message, 'SQLSTATE')) {
                return response()->json([
                    'message' => 'Service temporairement indisponible.',
                    'error' => 'database_unavailable',
                ], 503);
            }

            return null;
        });
    })->create();
