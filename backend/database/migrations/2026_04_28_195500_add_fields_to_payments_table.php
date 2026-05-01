<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_method')->default('cash')->after('remaining'); // cash, transfer, tpe, cmi
            $table->string('type')->default('payment')->after('payment_method'); // payment, deposit, refund
            $table->string('transaction_id')->nullable()->after('type'); // For CMI or TPE reference
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'type', 'transaction_id']);
        });
    }
};
