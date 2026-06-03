<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$vehicles = \App\Models\Vehicle::select('id', 'image_url')->get();
foreach ($vehicles as $vehicle) {
    echo "ID: {$vehicle->id}, URL: {$vehicle->image_url}\n";
}
