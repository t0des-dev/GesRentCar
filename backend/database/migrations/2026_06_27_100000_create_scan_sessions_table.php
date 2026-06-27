<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scan_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique()->index();
            $table->string('status')->default('pending'); // pending, scanning, completed, expired
            $table->text('qr_token')->nullable();

            // CIN data
            $table->string('cin_name')->nullable();
            $table->string('cin_number')->nullable();
            $table->string('cin_image_url')->nullable();

            // License data
            $table->string('license_number')->nullable();
            $table->string('license_image_url')->nullable();

            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scan_sessions');
    }
};
