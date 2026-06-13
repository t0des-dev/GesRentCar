<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index('status');
            $table->index('brand');
            $table->index('category');
            $table->index('type');
            $table->index('price_per_day');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->index('status');
            $table->index(['start_date', 'end_date']);
        });

        Schema::table('maintenances', function (Blueprint $table) {
            $table->index('status');
            $table->index('next_due');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['brand']);
            $table->dropIndex(['category']);
            $table->dropIndex(['type']);
            $table->dropIndex(['price_per_day']);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['start_date', 'end_date']);
        });

        Schema::table('maintenances', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['next_due']);
        });
    }
};
