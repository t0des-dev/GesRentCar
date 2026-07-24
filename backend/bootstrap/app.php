<?php

use App\Http\Middleware\AuditMiddleware;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\GracefulThrottle;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

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
            'graceful-throttle' => GracefulThrottle::class,
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
        $exceptions->renderable(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            // Database down — catch connection failures, lock timeouts, and file-based DB errors
            if ($e instanceof PDOException || str_contains($e->getMessage(), 'SQLSTATE')
                || str_contains($e->getMessage(), 'database is locked')
                || str_contains($e->getMessage(), 'no such table')
                || str_contains($e->getMessage(), 'unable to open')
            ) {
                \Log::error('Database unavailable: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Service temporairement indisponible. Veuillez réessayer dans quelques instants.',
                    'error' => 'database_unavailable',
                ], 503);
            }

            return null;
        });
    })->create();
