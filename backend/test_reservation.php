<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Http\Request;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Support\Facades\Facade;

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$data = [
    'vehicle_id' => 1,
    'start_date' => '2026-07-01',
    'end_date' => '2026-07-05',
    'client' => [
        'name' => 'Real Test User',
        'email' => 'realtest_' . time() . '@example.com',
        'phone' => '0612345678',
        'cin' => 'TEST' . time()
    ],
    'payment_method' => 'on_site',
    'signature' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
];

$request = Request::create('/api/public/reservations', 'POST', $data);
$controller = $app->make(ReservationController::class);

try {
    $response = $controller->publicStore($request);
    echo json_encode($response->getData(), JSON_PRETTY_PRINT);
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
