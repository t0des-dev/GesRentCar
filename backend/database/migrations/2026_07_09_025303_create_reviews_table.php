<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating')->unsigned();
            $table->string('title')->nullable();
            $table->text('comment')->nullable();
            $table->tinyInteger('cleanliness')->unsigned()->nullable();
            $table->tinyInteger('performance')->unsigned()->nullable();
            $table->tinyInteger('value_for_money')->unsigned()->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['user_id', 'reservation_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
