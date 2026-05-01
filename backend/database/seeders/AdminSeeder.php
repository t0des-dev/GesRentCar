<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Vectoria Admin',
            'email' => 'admin@vectoria.com',
            'password' => Hash::make('Admin2026!'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Agent Vectoria',
            'email' => 'agent@vectoria.com',
            'password' => Hash::make('Agent2026!'),
            'role' => 'agent'
        ]);
    }
}
