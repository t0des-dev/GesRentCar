<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $box) {
            $box->json('sections_order')->nullable();
            $box->json('testimonials')->nullable();
            $box->json('seo_config')->nullable();
            $box->json('social_hub')->nullable(); // For floating icons and links
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['sections_order', 'testimonials', 'seo_config', 'social_hub']);
        });
    }
};
