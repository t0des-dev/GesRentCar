<?php

namespace App\Filament\Resources\VehicleResource\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class MaintenancesRelationManager extends RelationManager
{
    protected static string $relationship = 'maintenances';

    protected static ?string $recordTitleAttribute = 'type';

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Forms\Components\Select::make('type')
                    ->options([
                        'vidange' => 'Vidange',
                        'pneus' => 'Changement Pneus',
                        'moteur' => 'Réparation Moteur',
                        'carrosserie' => 'Carrosserie',
                        'autre' => 'Autre',
                    ])
                    ->required(),
                Forms\Components\DatePicker::make('next_due')
                    ->label('Prochaine Échéance (Date)'),
                Forms\Components\TextInput::make('next_due_km')
                    ->label('Prochaine Échéance (Km)')
                    ->numeric(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'En attente',
                        'in_progress' => 'En cours',
                        'completed' => 'Terminé',
                    ])
                    ->required()
                    ->default('completed'),
                Forms\Components\TextInput::make('cost')
                    ->label('Coût')
                    ->numeric()
                    ->prefix('MAD'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('type')
            ->columns([
                Tables\Columns\TextColumn::make('type')
                    ->label('Type d\'intervention'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->date('d/m/Y'),
                Tables\Columns\TextColumn::make('next_due_km')
                    ->label('Prochaine (Km)')
                    ->suffix(' km'),
                Tables\Columns\TextColumn::make('cost')
                    ->label('Coût')
                    ->money('MAD'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'primary' => 'in_progress',
                        'success' => 'completed',
                    ]),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
