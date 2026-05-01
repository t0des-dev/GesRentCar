<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('hero_image_url')->nullable()->after('agency_primary_color');
            $table->text('about_text_fr')->nullable();
            $table->text('about_text_en')->nullable();
            $table->text('about_text_ar')->nullable();
            $table->json('sections_config')->nullable(); // Order and visibility
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['hero_image_url', 'about_text_fr', 'about_text_en', 'about_text_ar', 'sections_config']);
        });
    }
};
