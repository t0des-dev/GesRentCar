<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('avatar_url')->nullable()->after('phone');
            $table->string('referral_code', 8)->nullable()->unique()->after('avatar_url');
            $table->boolean('is_blacklisted')->default(false)->after('referral_code');
            $table->timestamp('last_login_at')->nullable()->after('is_blacklisted');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'avatar_url',
                'referral_code',
                'is_blacklisted',
                'last_login_at',
            ]);
        });
    }
};
