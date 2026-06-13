<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Resources\Pages\Page;
use App\Models\Vehicle;

class KanbanVehicles extends Page
{
    protected static string $resource = VehicleResource::class;

    protected string $view = 'filament.resources.vehicle-resource.pages.kanban-vehicles';
    
    protected static ?string $title = 'Véhicules (Kanban)';

    public function getColumns(): array
    {
        return [
            'available' => 'Disponibles',
            'rented' => 'En Location',
            'maintenance' => 'Au Garage',
        ];
    }

    public function getVehicles(): array
    {
        $vehicles = Vehicle::all();
        
        $columns = [
            'available' => [],
            'rented' => [],
            'maintenance' => [],
        ];
        
        foreach ($vehicles as $vehicle) {
            $status = $vehicle->status;
            if (isset($columns[$status])) {
                $columns[$status][] = $vehicle;
            }
        }
        
        return $columns;
    }

    public function updateStatus($vehicleId, $newStatus)
    {
        $vehicle = Vehicle::find($vehicleId);
        if ($vehicle && in_array($newStatus, array_keys($this->getColumns()))) {
            $vehicle->update(['status' => $newStatus]);
            
            // Notification
            \Filament\Notifications\Notification::make()
                ->title('Statut mis à jour')
                ->success()
                ->send();
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('grid_view')
                ->label('Vue Grille')
                ->icon('heroicon-m-squares-2x2')
                ->color('gray')
                ->url(VehicleResource::getUrl('index')),
            \Filament\Actions\Action::make('table_view')
                ->label('Vue Liste')
                ->icon('heroicon-m-list-bullet')
                ->color('gray')
                ->url(VehicleResource::getUrl('table')),
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
