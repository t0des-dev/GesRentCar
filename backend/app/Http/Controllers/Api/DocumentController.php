<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\PersonalAccessToken;

class DocumentController extends Controller
{
    /**
     * Serves a private document if the user is authenticated.
     * Accepts auth via:
     *   - Authorization: Bearer {token} header (Sanctum default)
     *   - ?token={token} query parameter (for <img> tags that can't set headers)
     */
    public function preview(Request $request, string $filename)
    {
        // If no authenticated user yet, try to authenticate via ?token= query param
        if (! $request->user()) {
            $token = $request->query('token');
            if ($token) {
                $accessToken = PersonalAccessToken::findToken($token);
                if ($accessToken) {
                    $request->setUser($accessToken->tokenable);
                }
            }
        }

        if (! $request->user()) {
            abort(401, 'Authentication required.');
        }

        $path = 'private/documents/clients/'.$filename;

        if (! Storage::exists($path)) {
            abort(404);
        }

        $file = Storage::get($path);
        $type = Storage::mimeType($path);

        return response($file, 200)->header('Content-Type', $type);
    }

    /**
     * Serve files from storage/app/public/.
     * Accepts paths like "vehicles/1781731905_xxx.webp"
     * Accessible via /api/storage/{path...}
     */
    public function serve(string ...$segments)
    {
        $path = implode('/', $segments);

        if (! Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $file = Storage::disk('public')->get($path);
        $type = Storage::disk('public')->mimeType($path);

        return response($file, 200, [
            'Content-Type' => $type,
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
