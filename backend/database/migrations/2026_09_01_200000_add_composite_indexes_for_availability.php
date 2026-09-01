<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Index composite optimisé pour les requêtes de disponibilité :
            // WHERE vehicle_id = ? AND status IN (...) AND start_date < ? AND end_date > ?
            $table->index(['vehicle_id', 'status', 'start_date', 'end_date'], 'res_avail_composite_idx');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex('res_avail_composite_idx');
        });
    }
};
