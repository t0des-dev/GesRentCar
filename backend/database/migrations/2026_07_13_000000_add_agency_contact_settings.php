<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = [
            ['key' => 'agency_address', 'value' => 'Casablanca, Maroc', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'agency_phone', 'value' => '+212 5 22 XX XX XX', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'agency_email', 'value' => 'contact@vectoria.ma', 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($defaults as $row) {
            DB::table('settings')->updateOrInsert(
                ['key' => $row['key']],
                $row
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['agency_address', 'agency_phone', 'agency_email'])->delete();
    }
};
