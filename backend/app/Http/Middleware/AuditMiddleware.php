<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log modifying requests
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            ActivityLog::create([
                'user_id' => $request->user()?->id,
                'action' => $request->method().' '.$request->path(),
                'ip_address' => $request->ip(),
                'details' => json_encode($request->except(['password', 'password_confirmation'])),
            ]);
        }

        return $response;
    }
}
