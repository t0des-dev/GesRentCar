<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CmiController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DemoController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ConciergeController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\OcrController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\ScanSessionController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\WaitlistController;
use App\Http\Controllers\Api\SavedSearchController;
use App\Http\Controllers\Api\MaintenanceScheduleController;
use App\Http\Controllers\Api\ClientBlacklistController;
use App\Http\Controllers\Api\LoyaltyController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\BookingReminderController;
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
        Route::get('/pages', [PageController::class, 'index']);
        Route::get('/pages/{slug}', [PageController::class, 'show']);

        Route::get('/vehicles', [VehicleController::class, 'index']);
        Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
        Route::post('/vehicles/{vehicle}/availability', [VehicleController::class, 'checkAvailability']);
        Route::post('/concierge/chat', [ConciergeController::class, 'chat']);

        // Public reservations
        Route::post('/public/reservations', [ReservationController::class, 'publicStore']);

        // ─── Public contract download & signature ─────────────────────────
        Route::get('/public/reservations/{reservation}/contract', [ContractController::class, 'download']);
        Route::get('/public/reservations/{reservation}/contract/file', [ContractController::class, 'file']);
        Route::post('/public/reservations/{reservation}/sign', [ContractController::class, 'publicSign']);

        // Public storage files (images, etc.)
        Route::get('/storage/{path...}', [DocumentController::class, 'serve']);

        // Cross-device scan: phone uploads (no auth, token-based)
        Route::get('/scan-sessions/{token}/status', [ScanSessionController::class, 'phoneShow']);
        Route::post('/scan-sessions/{token}/upload', [ScanSessionController::class, 'upload']);
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
        Route::get('/admin/pages', [PageController::class, 'adminIndex']);
        Route::post('/admin/pages', [PageController::class, 'store']);
        Route::put('/admin/pages/{page}', [PageController::class, 'update']);
        Route::delete('/admin/pages/{page}', [PageController::class, 'destroy']);

        Route::get('/exports/reservations', [ExportController::class, 'reservations']);
        Route::get('/exports/profit-loss', [ExportController::class, 'profitLoss']);

        Route::post('/reservations/{reservation}/contract', [ContractController::class, 'generate']);
        Route::get('/reservations/{reservation}/contract/file', [ContractController::class, 'file']);
        Route::post('/reservations/{reservation}/sign', [ContractController::class, 'sign']);

        Route::post('/ocr/scan', [OcrController::class, 'scan']);
        Route::post('/ocr/analyze-damage', [OcrController::class, 'analyzeDamage']);

        // Cross-device scan sessions (desktop creates, polls)
        Route::post('/scan-sessions', [ScanSessionController::class, 'store']);
        Route::get('/scan-sessions/{session}', [ScanSessionController::class, 'show']);

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

        // Waitlist
        Route::post('/waitlist', [WaitlistController::class, 'store']);
        Route::get('/waitlist', [WaitlistController::class, 'index']);

        // Saved Searches
        Route::get('/saved-searches', [SavedSearchController::class, 'index']);
        Route::post('/saved-searches', [SavedSearchController::class, 'store']);
        Route::delete('/saved-searches/{savedSearch}', [SavedSearchController::class, 'destroy']);

        // Loyalty
        Route::get('/loyalty/profile', [LoyaltyController::class, 'profile']);
        Route::get('/loyalty/history', [LoyaltyController::class, 'pointsHistory']);
        Route::post('/loyalty/redeem', [LoyaltyController::class, 'redeem']);

        // Referrals
        Route::get('/referral/code', [ReferralController::class, 'generateCode']);
        Route::get('/referral/stats', [ReferralController::class, 'stats']);
        Route::post('/referral/apply', [ReferralController::class, 'apply']);

        // Reviews
        Route::get('/reviews/vehicle/{vehicle}', [ReviewController::class, 'index']);
        Route::get('/reviews/vehicle/{vehicle}/stats', [ReviewController::class, 'vehicleStats']);
        Route::post('/reviews', [ReviewController::class, 'store']);

        // Comparisons
        Route::post('/comparisons', function (Request $request) {
            $request->validate(['vehicle_ids' => 'required|array|min:2|max:4']);
            $comparison = \App\Models\VehicleComparison::create([
                'user_id' => $request->user()?->id,
                'vehicle_ids' => $request->vehicle_ids,
                'session_id' => $request->header('X-Session-Id'),
            ]);
            return response()->json($comparison);
        });

        // Vehicle availability check for waitlist
        Route::get('/vehicles/{vehicle}/availability', [WaitlistController::class, 'checkAvailability']);

        // Blacklist check (during booking)
        Route::post('/blacklist/check', [ClientBlacklistController::class, 'check']);

        // Admin only
        Route::middleware('role:admin')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{user}', [UserController::class, 'update']);
            Route::delete('/users/{user}', [UserController::class, 'destroy']);

            // Demo data management
            Route::get('/admin/demo/stats', [DemoController::class, 'stats']);
            Route::post('/admin/demo/populate', [DemoController::class, 'populate']);
            Route::post('/admin/demo/clear', [DemoController::class, 'clear']);

            // Maintenance Schedules
            Route::get('/maintenance-schedules', [MaintenanceScheduleController::class, 'index']);
            Route::post('/maintenance-schedules', [MaintenanceScheduleController::class, 'store']);
            Route::put('/maintenance-schedules/{maintenanceSchedule}', [MaintenanceScheduleController::class, 'update']);
            Route::get('/maintenance-schedules/overdue', [MaintenanceScheduleController::class, 'overdue']);

            // Client Blacklist
            Route::get('/blacklist', [ClientBlacklistController::class, 'index']);
            Route::post('/blacklist', [ClientBlacklistController::class, 'store']);
            Route::delete('/blacklist/{clientBlacklist}', [ClientBlacklistController::class, 'destroy']);

            // Webhooks
            Route::get('/webhooks', [WebhookController::class, 'index']);
            Route::post('/webhooks', [WebhookController::class, 'store']);
            Route::put('/webhooks/{webhook}', [WebhookController::class, 'update']);
            Route::delete('/webhooks/{webhook}', [WebhookController::class, 'destroy']);
            Route::post('/webhooks/{webhook}/test', [WebhookController::class, 'test']);

            // Reviews Admin
            Route::put('/reviews/{review}/approve', [ReviewController::class, 'approve']);

            // Waitlist Admin
            Route::post('/waitlist/{waitlist}/notify', [WaitlistController::class, 'notifyAvailable']);

            // Booking Reminders
            Route::post('/admin/send-reminders', [BookingReminderController::class, 'sendReminders']);
        });
    });
};

// ─── API v1 (versioned) ───────────────────────────────────────────────────────
Route::prefix('v1')->name('v1.')->group($apiRoutes);

// ─── Unversioned aliases — compatibility for deployed frontend ────────────────
// Handles /api/* calls from frontend built without /v1 in NEXT_PUBLIC_API_URL
Route::name('compat.')->group($apiRoutes);
