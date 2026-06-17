<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Client Vectoria',
            'email' => 'client@vectoria.com',
            'password' => Hash::make('Client2026!'),
            'role' => 'client',
        ]);
    }
}
