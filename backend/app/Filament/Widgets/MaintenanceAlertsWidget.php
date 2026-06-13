<?php

namespace App\Filament\Widgets;

use App\Models\Vehicle;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class MaintenanceAlertsWidget extends BaseWidget
{
    protected static ?string $heading = 'Alertes de Maintenance & Conformité';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 3;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Vehicle::query()->where('status', 'maintenance')
                    ->orWhere('mileage', '>=', 50000)
                    ->orWhere('insurance_date', '<=', now()->addDays(15))
                    ->orWhere('tech_inspection_date', '<=', now()->addDays(15))
            )
            ->columns([
                Tables\Columns\TextColumn::make('plate')
                    ->label('Immatriculation')
                    ->searchable(),
                Tables\Columns\TextColumn::make('brand')
                    ->label('Marque'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'danger' => 'maintenance',
                        'warning' => fn ($state) => $state !== 'maintenance',
                    ])
                    ->formatStateUsing(fn ($state) => $state === 'maintenance' ? 'En Maintenance' : 'Révision Conseillée'),
                Tables\Columns\TextColumn::make('mileage')
                    ->label('Kilométrage')
                    ->suffix(' km'),
                Tables\Columns\TextColumn::make('insurance_date')
                    ->label('Assurance')
                    ->date('d/m/Y')
                    ->color(fn ($record) => $record->insurance_date && $record->insurance_date <= now() ? 'danger' : ($record->insurance_date && $record->insurance_date <= now()->addDays(15) ? 'warning' : 'success')),
                Tables\Columns\TextColumn::make('tech_inspection_date')
                    ->label('Visite Tech.')
                    ->date('d/m/Y')
                    ->color(fn ($record) => $record->tech_inspection_date && $record->tech_inspection_date <= now() ? 'danger' : ($record->tech_inspection_date && $record->tech_inspection_date <= now()->addDays(15) ? 'warning' : 'success')),
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
