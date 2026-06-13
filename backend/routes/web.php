<?php

use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// SPA fallback: serve the Next.js index.html for all frontend routes
// This MUST come last — catch-all matches everything
Route::get('/{any}', function () {
    $file = public_path('index.html');
    if (file_exists($file)) {
        return response()->file($file);
    }
    abort(404);
})->where('any', '.*');
