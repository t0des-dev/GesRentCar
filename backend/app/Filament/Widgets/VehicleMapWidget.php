<?php

namespace App\Filament\Widgets;

use App\Models\Vehicle;
use Filament\Widgets\Widget;

class VehicleMapWidget extends Widget
{
    protected string $view = 'filament.widgets.vehicle-map-widget';

    protected int | string | array $columnSpan = 'full';

    protected static ?int $sort = 4;

    protected function getViewData(): array
    {
        // Mocking some coordinates around Casablanca for active/available vehicles
        $vehicles = Vehicle::whereIn('status', ['available', 'rented'])->get()->map(function ($v, $index) {
            // Randomish coords around Casablanca (33.5731, -7.5898)
            $lat = 33.5731 + (rand(-100, 100) / 2000);
            $lng = -7.5898 + (rand(-100, 100) / 2000);
            
            return [
                'id' => $v->id,
                'name' => $v->brand . ' ' . $v->model,
                'plate' => $v->plate,
                'status' => $v->status,
                'lat' => $lat,
                'lng' => $lng,
            ];
        });

        return [
            'vehicles' => $vehicles,
        ];
    }
}
