<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 5)->index();
            $table->string('group')->index();
            $table->string('key')->index();
            $table->text('value')->nullable();
            $table->morphs('translatable');
            $table->unique(['locale', 'group', 'key', 'translatable_id', 'translatable_type'], 'translation_unique');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
