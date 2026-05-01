<?php

namespace App\Filament\Widgets;

use App\Models\Vehicle;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class MaintenanceAlertsWidget extends BaseWidget
{
    protected static ?string $heading = 'Alertes de Maintenance';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 3;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Vehicle::query()->where('status', 'maintenance')
                    ->orWhere('mileage', '>=', 50000) // Dummy threshold for alert
            )
            ->columns([
                Tables\Columns\TextColumn::make('plate')
                    ->label('Immatriculation')
                    ->searchable(),
                Tables\Columns\TextColumn::make('brand')
                    ->label('Marque'),
                Tables\Columns\TextColumn::make('model')
                    ->label('Modèle'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'danger' => 'maintenance',
                        'warning' => fn ($state) => $state !== 'maintenance', // Needs check
                    ])
                    ->formatStateUsing(fn ($state) => $state === 'maintenance' ? 'En Maintenance' : 'Révision Conseillée'),
                Tables\Columns\TextColumn::make('mileage')
                    ->label('Kilométrage')
                    ->suffix(' km'),
            ])
            ->actions([
                Tables\Actions\Action::make('mark_active')
                    ->label('Marquer Actif')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Vehicle $record): bool => $record->status === 'maintenance')
                    ->action(function (Vehicle $record) {
                        $record->update(['status' => 'available']);
                    }),
                Tables\Actions\Action::make('send_maintenance')
                    ->label('Envoyer au Garage')
                    ->icon('heroicon-o-wrench')
                    ->color('danger')
                    ->visible(fn (Vehicle $record): bool => $record->status !== 'maintenance')
                    ->action(function (Vehicle $record) {
                        $record->update(['status' => 'maintenance']);
                    }),
            ]);
    }
}
