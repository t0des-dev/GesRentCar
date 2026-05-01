<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-truck';
    protected static string | \UnitEnum | null $navigationGroup = 'Fleet Management';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Vehicle Details')
                    ->schema([
                        Forms\Components\TextInput::make('brand')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('model')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('plate')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\Select::make('type')
                            ->options([
                                'internal' => 'Internal Fleet',
                                'collaborator' => 'Collaborator',
                            ])
                            ->required(),
                    ])->columns(2),

                Forms\Components\Section::make('Pricing & Status')
                    ->schema([
                        Forms\Components\TextInput::make('price_per_day')
                            ->required()
                            ->numeric()
                            ->prefix('MAD'),
                        Forms\Components\TextInput::make('mileage')
                            ->required()
                            ->numeric(),
                        Forms\Components\Select::make('status')
                            ->options([
                                'available' => 'Available',
                                'rented' => 'Rented',
                                'maintenance' => 'In Maintenance',
                            ])
                            ->required(),
                        Forms\Components\FileUpload::make('image_url')
                            ->image()
                            ->directory('vehicles'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->circular(),
                Tables\Columns\TextColumn::make('brand')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('model')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('plate')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price_per_day')
                    ->money('MAD')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'available',
                        'warning' => 'maintenance',
                        'danger' => 'rented',
                    ]),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'available' => 'Available',
                        'rented' => 'Rented',
                        'maintenance' => 'In Maintenance',
                    ]),
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'internal' => 'Internal',
                        'collaborator' => 'Collaborator',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }
}
