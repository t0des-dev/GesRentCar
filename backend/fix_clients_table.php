<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    Schema::table('clients', function (Blueprint $table) {
        if (!Schema::hasColumn('clients', 'license_number')) {
            $table->string('license_number')->nullable();
        }
        if (!Schema::hasColumn('clients', 'cin_image_url')) {
            $table->string('cin_image_url')->nullable();
        }
        if (!Schema::hasColumn('clients', 'license_image_url')) {
            $table->string('license_image_url')->nullable();
        }
    });
    echo "Clients table updated successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
