<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Filament\Resources\VehicleResource\RelationManagers;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

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
                Forms\Components\Tabs::make('Vehicle Details')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Général')
                            ->icon('heroicon-o-information-circle')
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
                                Forms\Components\Select::make('category')
                                    ->options([
                                        'economy' => 'Economique',
                                        'suv' => 'SUV',
                                        'luxury' => 'Luxe',
                                        'utility' => 'Utilitaire',
                                    ]),
                                Forms\Components\Select::make('type')
                                    ->options([
                                        'internal' => 'Internal Fleet',
                                        'collaborator' => 'Collaborator',
                                    ])
                                    ->required(),
                                Forms\Components\FileUpload::make('image_url')
                                    ->image()
                                    ->directory('vehicles'),
                            ])->columns(2),

                        Forms\Components\Tabs\Tab::make('Technique')
                            ->icon('heroicon-o-wrench-screwdriver')
                            ->schema([
                                Forms\Components\TextInput::make('mileage')
                                    ->required()
                                    ->numeric()
                                    ->suffix('km'),
                                Forms\Components\Select::make('fuel_type')
                                    ->options([
                                        'diesel' => 'Diesel',
                                        'essence' => 'Essence',
                                        'hybride' => 'Hybride',
                                        'electrique' => 'Electrique',
                                    ]),
                                Forms\Components\Select::make('transmission')
                                    ->options([
                                        'manuelle' => 'Manuelle',
                                        'automatique' => 'Automatique',
                                    ]),
                                Forms\Components\TextInput::make('year')
                                    ->numeric()
                                    ->minValue(1990)
                                    ->maxValue(date('Y') + 1),
                                Forms\Components\ColorPicker::make('color'),
                            ])->columns(2),

                        Forms\Components\Tabs\Tab::make('Tarification')
                            ->icon('heroicon-o-currency-dollar')
                            ->schema([
                                Forms\Components\TextInput::make('price_per_day')
                                    ->required()
                                    ->numeric()
                                    ->prefix('MAD'),
                                Forms\Components\TextInput::make('commission_rate')
                                    ->numeric()
                                    ->suffix('%')
                                    ->visible(fn (Forms\Get $get) => $get('type') === 'collaborator'),
                            ])->columns(2),

                        Forms\Components\Tabs\Tab::make('Documents & Assurance')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Forms\Components\DatePicker::make('insurance_date')
                                    ->label('Date d\'expiration Assurance'),
                                Forms\Components\DatePicker::make('tech_inspection_date')
                                    ->label('Date Visite Technique'),
                                Forms\Components\DatePicker::make('vignette_date')
                                    ->label('Date Vignette'),
                                Forms\Components\FileUpload::make('photos')
                                    ->multiple()
                                    ->image()
                                    ->panelLayout('grid')
                                    ->directory('vehicles/gallery')
                                    ->columnSpanFull(),
                            ])->columns(2),
                    ])
                    ->columnSpanFull()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->contentGrid([
                'md' => 2,
                'xl' => 3,
            ])
            ->columns([
                Tables\Columns\Layout\Stack::make([
                    Tables\Columns\ImageColumn::make('image_url')
                        ->height('200px')
                        ->width('100%')
                        ->extraImgAttributes(['class' => 'object-cover rounded-t-xl']),
                    Tables\Columns\Layout\Stack::make([
                        Tables\Columns\TextColumn::make('brand')
                            ->weight('bold')
                            ->size('lg')
                            ->formatStateUsing(fn ($record) => $record->brand . ' ' . $record->model)
                            ->searchable(['brand', 'model']),
                        Tables\Columns\TextColumn::make('plate')
                            ->color('gray')
                            ->icon('heroicon-m-identification'),
                        Tables\Columns\TextColumn::make('price_per_day')
                            ->money('MAD')
                            ->color('primary')
                            ->weight('bold'),
                        Tables\Columns\TextColumn::make('status')
                            ->badge()
                            ->colors([
                                'success' => 'available',
                                'warning' => 'maintenance',
                                'danger' => 'rented',
                            ]),
                    ])->space(2)->extraAttributes(['class' => 'p-4']),
                ])->space(0),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'available' => 'Available',
                        'rented' => 'Rented',
                        'maintenance' => 'In Maintenance',
                    ]),
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'economy' => 'Economique',
                        'suv' => 'SUV',
                        'luxury' => 'Luxe',
                    ]),
                Tables\Filters\Filter::make('expired_insurance')
                    ->label('Assurance Expirée')
                    ->query(fn (Builder $query): Builder => $query->where('insurance_date', '<', now())),
                Tables\Filters\Filter::make('expired_tech')
                    ->label('Visite Tech. Expirée')
                    ->query(fn (Builder $query): Builder => $query->where('tech_inspection_date', '<', now())),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('maintenance')
                    ->label('Garage')
                    ->icon('heroicon-o-wrench')
                    ->color('warning')
                    ->visible(fn (Vehicle $record) => $record->status === 'available')
                    ->action(fn (Vehicle $record) => $record->update(['status' => 'maintenance'])),
                Tables\Actions\Action::make('available')
                    ->label('Disponible')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (Vehicle $record) => $record->status === 'maintenance')
                    ->action(fn (Vehicle $record) => $record->update(['status' => 'available'])),
                Tables\Actions\RestoreAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(Schema $infolist): Schema
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Informations Véhicule')
                    ->schema([
                        Infolists\Components\ImageEntry::make('image_url')
                            ->hiddenLabel()
                            ->columnSpanFull()
                            ->height(300),
                        Infolists\Components\TextEntry::make('brand')
                            ->label('Marque & Modèle')
                            ->formatStateUsing(fn ($record) => $record->brand . ' ' . $record->model)
                            ->weight('bold')
                            ->size('lg'),
                        Infolists\Components\TextEntry::make('plate')
                            ->label('Immatriculation'),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'available' => 'success',
                                'rented' => 'danger',
                                'maintenance' => 'warning',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('mileage')
                            ->label('Kilométrage')
                            ->suffix(' km'),
                        Infolists\Components\TextEntry::make('price_per_day')
                            ->label('Prix / Jour')
                            ->money('MAD'),
                    ])->columns(3),
                Infolists\Components\Section::make('Dates & Conformité')
                    ->schema([
                        Infolists\Components\TextEntry::make('insurance_date')
                            ->label('Assurance')
                            ->date('d/m/Y'),
                        Infolists\Components\TextEntry::make('tech_inspection_date')
                            ->label('Visite Technique')
                            ->date('d/m/Y'),
                    ])->columns(2),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ReservationsRelationManager::class,
            RelationManagers\MaintenancesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicles::route('/'),
            'table' => Pages\TableVehicles::route('/table'),
            'kanban' => Pages\KanbanVehicles::route('/kanban'),
            'create' => Pages\CreateVehicle::route('/create'),
            'view' => Pages\ViewVehicle::route('/{record}'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getWidgets(): array
    {
        return [
            \App\Filament\Widgets\StatsOverview::class,
        ];
    }
}
