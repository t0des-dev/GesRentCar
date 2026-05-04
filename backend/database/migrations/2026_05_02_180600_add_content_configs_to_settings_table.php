<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            if (!Schema::hasColumn('settings', 'faq_config')) {
                $table->json('faq_config')->nullable();
            }
            if (!Schema::hasColumn('settings', 'features_config')) {
                $table->json('features_config')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['faq_config', 'features_config']);
        });
    }
};
