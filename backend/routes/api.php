<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CmiController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\OcrController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// ─── Health Check (no versioning) ─────────────────────────────────────────────
Route::get('/health', function (): JsonResponse {
    $checks = [
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'php' => PHP_VERSION,
        'laravel' => app()->version(),
    ];

    try {
        DB::connection()->getPdo();
        $checks['database'] = 'ok';
    } catch (Exception $e) {
        $checks['database'] = 'error';
        $checks['status'] = 'degraded';
    }

    $statusCode = $checks['status'] === 'ok' ? 200 : 503;

    return response()->json($checks, $statusCode);
});

// ─── Sanctum CSRF alias for frontend calling /api/sanctum/csrf-cookie ─────────
Route::get('/sanctum/csrf-cookie', function () {
    return app()->make(\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class)
        ->show(request());
});

// ─── Shared route definitions (applied to both /v1 and unversioned) ────────────
$apiRoutes = function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware(['auth:sanctum', 'throttle:api']);

    // Auth (rate limited: 5 attempts/min per IP)
    Route::prefix('auth')->middleware('throttle:auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
    });
    Route::prefix('auth')->group(function () {
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', function (Request $request) {
                return [
                    'user' => $request->user(),
                ];
            });
        });
    });

    Route::middleware('throttle:public')->group(function () {
        Route::get('/config', [ConfigController::class, 'index']);

        Route::get('/vehicles', [VehicleController::class, 'index']);
        Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);

        // Public reservations
        Route::post('/public/reservations', [ReservationController::class, 'publicStore']);

        // ─── Public contract download & signature ─────────────────────────
        Route::get('/public/reservations/{reservation}/contract', [ContractController::class, 'download']);
        Route::post('/public/reservations/{reservation}/sign', [ContractController::class, 'publicSign']);
    });

    // ─── Stripe (rate limited: 10 req/min per IP) ──────────────────────────────
    Route::middleware('throttle:payment')->group(function () {
        Route::post('/stripe/intent', [StripeController::class, 'createIntent']);
        Route::post('/stripe/confirm', [StripeController::class, 'confirm']);
        Route::post('/stripe/webhook', [StripeController::class, 'webhook']);

        // ─── CMI Maroc ───────────────────────────────────────────────────────────────
        Route::post('/cmi/init/{reservation}', [CmiController::class, 'init']);
        Route::post('/cmi/callback', [CmiController::class, 'callback']);
    });

    // Protected routes (auth + audit + rate limit)
    Route::middleware(['auth:sanctum', 'audit', 'throttle:api'])->group(function () {
        Route::apiResource('/clients', ClientController::class);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/reservations/my', [ReservationController::class, 'my']);
        Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
        Route::post('/reservations/{reservation}/accept', [ReservationController::class, 'accept']);
        Route::post('/reservations/{reservation}/reject', [ReservationController::class, 'reject']);
        Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);

        // Stats
        Route::get('stats/revenue', [StatsController::class, 'revenueByCategory']);
        Route::get('stats/calendar', [StatsController::class, 'calendarData']);
        Route::get('stats/general', [StatsController::class, 'generalStats']);
        Route::get('stats/profitability', [StatsController::class, 'vehicleProfitability']);

        Route::post('/payments', [PaymentController::class, 'store']);
        Route::post('/payments/{reservationId}/release-deposit', [PaymentController::class, 'releaseDeposit']);
        Route::get('/stats', [StatsController::class, 'generalStats']);
        Route::post('/config', [ConfigController::class, 'update']);
        Route::post('/config/upload', [ConfigController::class, 'uploadAsset']);

        Route::get('/exports/reservations', [ExportController::class, 'reservations']);
        Route::get('/exports/profit-loss', [ExportController::class, 'profitLoss']);

        Route::post('/reservations/{reservation}/contract', [ContractController::class, 'generate']);
        Route::post('/reservations/{reservation}/sign', [ContractController::class, 'sign']);

        Route::post('/ocr/scan', [OcrController::class, 'scan']);
        Route::post('/ocr/analyze-damage', [OcrController::class, 'analyzeDamage']);

        // Fleet Management
        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
        Route::post('/vehicles/{vehicle}/image', [VehicleController::class, 'uploadImage']);
        Route::post('/vehicles/{vehicle}/photos', [VehicleController::class, 'uploadPhotos']);
        Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);

        Route::get('/documents/preview/{filename}', [DocumentController::class, 'preview']);

        Route::apiResource('maintenances', MaintenanceController::class);

        // Invoices
        Route::apiResource('invoices', InvoiceController::class);
        Route::get('invoices/{invoice}/download', [InvoiceController::class, 'download']);
        Route::post('invoices/{invoice}/pay', [InvoiceController::class, 'markAsPaid']);

        // Expenses
        Route::apiResource('expenses', ExpenseController::class);
        Route::post('expenses/{expense}/receipt', [ExpenseController::class, 'uploadReceipt']);

        // User Profile
        Route::get('/user/profile', function (Request $request) {
            return $request->user();
        });
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);

        // Admin only
        Route::middleware('role:admin')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{user}', [UserController::class, 'update']);
            Route::delete('/users/{user}', [UserController::class, 'destroy']);
        });
    });
};

// ─── API v1 (versioned) ───────────────────────────────────────────────────────
Route::prefix('v1')->group($apiRoutes);

// ─── Unversioned aliases — compatibility for deployed frontend ────────────────
// Handles /api/* calls from frontend built without /v1 in NEXT_PUBLIC_API_URL
Route::group([], $apiRoutes);
