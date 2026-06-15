<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class FleetSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            [
                'brand' => 'Range Rover',
                'model' => 'Sport',
                'plate' => '1234-A-1',
                'price_per_day' => 1500.00,
                'status' => 'available',
                'type' => 'internal',
                'category' => 'suv',
                'transmission' => 'automatic',
                'seats' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'brand' => 'BMW',
                'model' => 'X5',
                'plate' => '5678-B-2',
                'price_per_day' => 1200.00,
                'status' => 'available',
                'type' => 'internal',
                'category' => 'suv',
                'transmission' => 'automatic',
                'seats' => 7,
                'image_url' => 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'brand' => 'Mercedes',
                'model' => 'Classe C',
                'plate' => '9012-C-3',
                'price_per_day' => 850.00,
                'status' => 'available',
                'type' => 'internal',
                'category' => 'sedan',
                'transmission' => 'automatic',
                'seats' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'brand' => 'Fiat',
                'model' => '500',
                'plate' => '3456-D-4',
                'price_per_day' => 350.00,
                'status' => 'available',
                'type' => 'collaborator',
                'category' => 'compact',
                'transmission' => 'manual',
                'seats' => 4,
                'image_url' => 'https://images.unsplash.com/photo-1502675135487-e971002a6adb?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'brand' => 'Porsche',
                'model' => '911 Carrera',
                'plate' => '7890-E-5',
                'price_per_day' => 3500.00,
                'status' => 'available',
                'type' => 'internal',
                'category' => 'sport',
                'transmission' => 'automatic',
                'seats' => 2,
                'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
            ]
        ];

        foreach ($vehicles as $v) {
            Vehicle::updateOrCreate(['plate' => $v['plate']], $v);
        }
    }
}
