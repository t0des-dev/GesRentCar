<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$res = \App\Models\Reservation::first();
if ($res) {
    app(\App\Services\NotificationService::class)->notifyReservationConfirmed($res);
    echo "Notification sent for reservation {$res->id}\n";
} else {
    echo "No reservations found.\n";
}
