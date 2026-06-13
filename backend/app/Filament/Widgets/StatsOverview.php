<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Vehicle;
use App\Models\Reservation;

class StatsOverview extends StatsOverviewWidget
{
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $totalVehicles = Vehicle::count();
        $rentedVehicles = Vehicle::where('status', 'rented')->count();
        $maintenanceCount = Vehicle::where('status', 'maintenance')->count();
        $revenue = Reservation::whereMonth('created_at', now()->month)->whereIn('status', ['confirmed', 'completed'])->sum('total_price');

        $utilizationRate = $totalVehicles > 0 ? round(($rentedVehicles / $totalVehicles) * 100, 1) : 0;

        return [
            Stat::make('Taux de Rotation', $utilizationRate . '%')
                ->description($rentedVehicles . ' véhicules loués sur ' . $totalVehicles)
                ->descriptionIcon('heroicon-m-arrow-path-rounded-square')
                ->color($utilizationRate > 70 ? 'success' : 'warning')
                ->chart([30, 40, 50, 60, $utilizationRate]),

            Stat::make('En Maintenance', $maintenanceCount)
                ->description($maintenanceCount > 0 ? 'Action requise' : 'Flotte saine')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color($maintenanceCount > 0 ? 'danger' : 'success'),

            Stat::make('Chiffre d\'Affaires (Mois)', number_format($revenue, 2, ',', ' ') . ' DH')
                ->description('Total généré ce mois')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('primary')
                ->chart([1500, 2300, 1800, 3200, 2900, 4100, 4500]),
        ];
    }
}
