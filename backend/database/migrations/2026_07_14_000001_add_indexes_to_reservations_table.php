<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            if (! Schema::hasIndex('reservations', 'reservations_status_index')) {
                $table->index('status');
            }
            if (! Schema::hasIndex('reservations', 'reservations_start_date_index')) {
                $table->index('start_date');
            }
            if (! Schema::hasIndex('reservations', 'reservations_end_date_index')) {
                $table->index('end_date');
            }
            if (! Schema::hasIndex('reservations', 'reservations_vehicle_id_status_start_date_end_date_index')) {
                $table->index(['vehicle_id', 'status', 'start_date', 'end_date']);
            }
            if (! Schema::hasIndex('reservations', 'reservations_client_id_index')) {
                $table->index('client_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['start_date']);
            $table->dropIndex(['end_date']);
            $table->dropIndex(['vehicle_id', 'status', 'start_date', 'end_date']);
            $table->dropIndex(['client_id']);
        });
    }
};
