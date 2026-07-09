<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waitlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->date('desired_start_date');
            $table->date('desired_end_date');
            $table->enum('status', ['waiting', 'notified', 'converted', 'expired'])->default('waiting');
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();
            $table->unique(['email', 'vehicle_id', 'desired_start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waitlists');
    }
};
