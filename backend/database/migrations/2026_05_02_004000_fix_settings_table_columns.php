<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Check if column exists before adding (to avoid errors if someone manually added them)
            if (! Schema::hasColumn('settings', 'agency_slogan')) {
                $table->string('agency_slogan')->nullable()->after('value');
            }
            if (! Schema::hasColumn('settings', 'agency_primary_color')) {
                $table->string('agency_primary_color')->nullable()->after('agency_slogan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['agency_slogan', 'agency_primary_color']);
        });
    }
};
