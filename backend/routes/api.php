<?php

use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\StripeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public search
// Auth
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', function (Request $request) {
            return [
                'user' => $request->user(),
            ];
        });
    });
});

Route::get('/config', [\App\Http\Controllers\Api\ConfigController::class, 'index']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);

// Public reservations
Route::post('/public/reservations', [ReservationController::class, 'publicStore']);

// ─── Public contract download & signature ─────────────────────────
Route::get('/public/reservations/{reservation}/contract', [\App\Http\Controllers\Api\ContractController::class, 'download']);
Route::post('/public/reservations/{reservation}/sign', [\App\Http\Controllers\Api\ContractController::class, 'publicSign']);

// ─── Stripe ───────────────────────────────────────────────────────────────────
Route::post('/stripe/intent',   [StripeController::class, 'createIntent']);
Route::post('/stripe/confirm',  [StripeController::class, 'confirm']);
Route::post('/stripe/webhook',  [StripeController::class, 'webhook']);

// ─── CMI Maroc ───────────────────────────────────────────────────────────────
Route::post('/cmi/init/{reservation}', [\App\Http\Controllers\Api\CmiController::class, 'init']);
Route::post('/cmi/callback',           [\App\Http\Controllers\Api\CmiController::class, 'callback']);

// Reservations (Protected)
Route::middleware(['auth:sanctum', 'audit'])->group(function () {
    Route::apiResource('/clients', \App\Http\Controllers\Api\ClientController::class);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/my', [ReservationController::class, 'my']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::post('/reservations/{reservation}/accept', [ReservationController::class, 'accept']);
    Route::post('/reservations/{reservation}/reject', [ReservationController::class, 'reject']);

    // Stats
    Route::get('stats/revenue', [\App\Http\Controllers\Api\StatsController::class, 'revenueByCategory']);
    Route::get('stats/calendar', [\App\Http\Controllers\Api\StatsController::class, 'calendarData']);
    Route::get('stats/general', [\App\Http\Controllers\Api\StatsController::class, 'generalStats']);
    Route::get('stats/profitability', [\App\Http\Controllers\Api\StatsController::class, 'vehicleProfitability']);

    Route::post('/payments', [\App\Http\Controllers\Api\PaymentController::class, 'store']);
    Route::get('/stats', [\App\Http\Controllers\Api\StatsController::class, 'generalStats']);
    Route::post('/config', [\App\Http\Controllers\Api\ConfigController::class, 'update']);

    Route::get('/exports/reservations', [\App\Http\Controllers\Api\ExportController::class, 'reservations']);
    
    Route::post('/reservations/{reservation}/contract', [\App\Http\Controllers\Api\ContractController::class, 'generate']);
    Route::post('/reservations/{reservation}/sign', [\App\Http\Controllers\Api\ContractController::class, 'sign']);
    
    Route::post('/ocr/scan', [\App\Http\Controllers\Api\OcrController::class, 'scan']);
    Route::post('/ocr/analyze-damage', [\App\Http\Controllers\Api\OcrController::class, 'analyzeDamage']);
    
    // Fleet Management
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
    Route::post('/vehicles/{vehicle}/image', [VehicleController::class, 'uploadImage']);
    Route::post('/vehicles/{vehicle}/photos', [VehicleController::class, 'uploadPhotos']);
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);

    Route::get('/documents/preview/{filename}', [\App\Http\Controllers\Api\DocumentController::class, 'preview']);

    Route::apiResource('maintenances', \App\Http\Controllers\Api\MaintenanceController::class);

    // User Profile
    Route::get('/user/profile', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\Api\UserController::class, 'index']);
        Route::post('/users', [\App\Http\Controllers\Api\UserController::class, 'store']);
        Route::put('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'update']);
        Route::delete('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);
    });
});
