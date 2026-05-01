<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $maintenanceCount = \App\Models\Vehicle::where('status', 'maintenance')->count();
        $revenue = \App\Models\Reservation::whereMonth('created_at', now()->month)->sum('total_price');

        return [
            Stat::make('Total Véhicules', \App\Models\Vehicle::count())
                ->description('Flotte globale')
                ->descriptionIcon('heroicon-m-truck')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('En Location', \App\Models\Reservation::where('status', 'active')->count())
                ->description('Sur la route')
                ->descriptionIcon('heroicon-m-key')
                ->color('primary')
                ->chart([1, 4, 2, 8, 5, 9, 12]),

            Stat::make('Véhicules en Maintenance', $maintenanceCount)
                ->description($maintenanceCount > 0 ? 'Action requise' : 'Flotte saine')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color($maintenanceCount > 0 ? 'danger' : 'success'),

            Stat::make('Chiffre d\'Affaires (Mois)', number_format($revenue, 2, ',', ' ') . ' DH')
                ->description('Total généré ce mois')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning')
                ->chart([1500, 2300, 1800, 3200, 2900, 4100, 4500]),
        ];
    }
}
