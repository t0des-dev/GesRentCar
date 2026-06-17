<?php

namespace App\Filament\Widgets;

use App\Models\Reservation;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class RevenueChart extends ChartWidget
{
    protected ?string $heading = 'Revenus des 6 derniers mois';

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        // Simple aggregation for the last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $labels[] = $month->translatedFormat('M Y');

            $revenue = Reservation::whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total_price');
            $data[] = $revenue;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Chiffre d\'Affaires (DH)',
                    'data' => $data,
                    'backgroundColor' => '#ca8a04', // warning/gold color
                    'borderColor' => '#ca8a04',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
