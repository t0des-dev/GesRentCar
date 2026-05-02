<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Client Vectoria',
            'email' => 'client@vectoria.com',
            'password' => \Illuminate\Support\Facades\Hash::make('Client2026!'),
            'role' => 'client'
        ]);
    }
}
