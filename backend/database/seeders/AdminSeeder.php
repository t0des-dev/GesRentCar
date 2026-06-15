<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::upsert(
            [
                [
                    'email' => 'admin@vectoria.com',
                    'name' => 'Vectoria Admin',
                    'password' => Hash::make('Admin2026!'),
                    'role' => 'admin'
                ],
                [
                    'email' => 'agent@vectoria.com',
                    'name' => 'Agent Vectoria',
                    'password' => Hash::make('Agent2026!'),
                    'role' => 'agent'
                ]
            ],
            ['email'],
            ['name', 'password', 'role']
        );
    }
}
