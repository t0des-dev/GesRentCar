<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $col) {
            $col->id();
            $col->string('key')->unique();
            $col->text('value')->nullable();
            $col->timestamps();
        });

        // Initialiser avec les valeurs par défaut
        DB::table('settings')->insert([
            ['key' => 'agency_name', 'value' => 'Vectoria Rent Car'],
            ['key' => 'agency_slogan', 'value' => 'Premium Car Rental Experience'],
            ['key' => 'agency_primary_color', 'value' => '#6366f1'],
            ['key' => 'agency_logo_url', 'value' => '/logo.png'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
