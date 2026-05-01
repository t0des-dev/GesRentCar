<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$res = \App\Models\Reservation::find(1001);
if ($res) {
    app(\App\Http\Controllers\Api\ContractController::class)->generate($res);
    echo "Contract generated for 1001.\n";
} else {
    echo "Reservation 1001 not found.\n";
}
