<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables\Table;
use Filament\Tables;

class TableVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;
    
    protected static ?string $title = 'Véhicules (Liste)';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Photo')
                    ->circular(),
                Tables\Columns\TextColumn::make('brand')
                    ->label('Marque & Modèle')
                    ->formatStateUsing(fn ($record) => $record->brand . ' ' . $record->model)
                    ->searchable(['brand', 'model'])
                    ->sortable(),
                Tables\Columns\TextColumn::make('plate')
                    ->label('Immatriculation')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->colors([
                        'success' => 'available',
                        'warning' => 'maintenance',
                        'danger' => 'rented',
                    ]),
                Tables\Columns\TextColumn::make('price_per_day')
                    ->label('Prix / Jour')
                    ->money('MAD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('mileage')
                    ->label('Kilométrage')
                    ->suffix(' km')
                    ->sortable(),
                Tables\Columns\TextColumn::make('insurance_date')
                    ->label('Assurance')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'available' => 'Available',
                        'rented' => 'Rented',
                        'maintenance' => 'In Maintenance',
                    ]),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('maintenance')
                    ->label('Garage')
                    ->icon('heroicon-o-wrench')
                    ->color('warning')
                    ->visible(fn ($record) => $record->status === 'available')
                    ->action(fn ($record) => $record->update(['status' => 'maintenance'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('kanban_view')
                ->label('Vue Kanban')
                ->icon('heroicon-m-squares-plus')
                ->color('gray')
                ->url(VehicleResource::getUrl('kanban')),
            Actions\Action::make('grid_view')
                ->label('Vue Grille')
                ->icon('heroicon-m-squares-2x2')
                ->color('gray')
                ->url(VehicleResource::getUrl('index')),
            Actions\CreateAction::make(),
        ];
    }
}
