<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$r = \App\Models\Reservation::first();
if ($r) {
    \Illuminate\Support\Facades\DB::table('reservations')->where('id', $r->id)->update(['id' => 1001]);
    echo "Updated reservation ID to 1001.\n";
}
