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

        // Catch infrastructure failures (cache down, DB missing tables, etc.)
        // and return clean JSON instead of 500 with stack trace.
        $exceptions->renderable(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $message = class_basename(get_class($e)).': '.$e->getMessage();

            // Cache/store failures (Redis down, missing table)
            if ($e instanceof \Predis\PredisConnectionException
                || $e instanceof \Illuminate\Redis\Connections\ConnectionException
                || str_contains($message, 'Connection')
                || str_contains($message, 'cache')
                || str_contains($message, 'Redis')
            ) {
                return response()->json([
                    'message' => 'Service temporairement indisponible.',
                    'error' => 'cache_unavailable',
                ], 503);
            }

            // Database table missing
            if (str_contains($message, 'relation')
                || str_contains($message, 'does not exist')
                || str_contains($message, 'column')
                || $e instanceof \PDOException
            ) {
                return response()->json([
                    'message' => 'Erreur de base de données. Veuillez réessayer.',
                    'error' => 'database_error',
                ], 503);
            }

            return null;
        });
    })->create();
