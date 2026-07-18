<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('maintenances', function (Blueprint $table) {
            $table->text('description')->nullable()->after('type');
            $table->decimal('cost', 10, 2)->nullable()->after('description');
            $table->date('maintenance_date')->nullable()->after('next_due');
        });
    }

    public function down(): void
    {
        Schema::table('maintenances', function (Blueprint $table) {
            $table->dropColumn(['description', 'cost', 'maintenance_date']);
        });
    }
};
