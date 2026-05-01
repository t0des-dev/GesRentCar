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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->string('plate')->unique();
            $table->decimal('price_per_day', 10, 2);
            $table->string('status')->default('available'); // available, rented, maintenance
            $table->foreignId('agent_id')->nullable()->constrained('users');
            $table->string('type')->default('internal'); // internal, collaborator
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
