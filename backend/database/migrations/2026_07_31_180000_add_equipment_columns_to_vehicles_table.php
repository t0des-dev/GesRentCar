<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->boolean('bluetooth')->default(false)->after('air_conditioning');
            $table->boolean('rear_camera')->default(false)->after('bluetooth');
            $table->boolean('carplay')->default(false)->after('rear_camera');
            $table->boolean('isofix')->default(false)->after('carplay');
            $table->boolean('cruise_control')->default(false)->after('isofix');
            $table->boolean('sunroof')->default(false)->after('cruise_control');
            $table->boolean('leather_seats')->default(false)->after('sunroof');
            $table->boolean('electric_windows')->default(false)->after('leather_seats');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'bluetooth', 'rear_camera', 'carplay', 'isofix',
                'cruise_control', 'sunroof', 'leather_seats', 'electric_windows',
            ]);
        });
    }
};
