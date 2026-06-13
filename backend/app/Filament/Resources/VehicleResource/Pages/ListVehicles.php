<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('kanban_view')
                ->label('Vue Kanban')
                ->icon('heroicon-m-squares-plus')
                ->color('gray')
                ->url(VehicleResource::getUrl('kanban')),
            Actions\Action::make('table_view')
                ->label('Vue Liste')
                ->icon('heroicon-m-list-bullet')
                ->color('gray')
                ->url(VehicleResource::getUrl('table')),
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\StatsOverview::class,
        ];
    }
}
