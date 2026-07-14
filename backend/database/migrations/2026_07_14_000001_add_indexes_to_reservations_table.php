<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
            $table->index(['vehicle_id', 'status', 'start_date', 'end_date']);
            $table->index('client_id');
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
