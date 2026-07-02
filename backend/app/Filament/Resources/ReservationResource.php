<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReservationResource\Pages;
use App\Models\Reservation;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class ReservationResource extends Resource
{
    protected static ?string $model = Reservation::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|\UnitEnum|null $navigationGroup = 'Bookings';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations Client')
                    ->schema([
                        Forms\Components\Placeholder::make('client_name')
                            ->content(fn ($record) => $record?->client?->name ?? '—'),
                        Forms\Components\Placeholder::make('client_email')
                            ->content(fn ($record) => $record?->client?->email ?? '—'),
                        Forms\Components\Placeholder::make('client_phone')
                            ->content(fn ($record) => $record?->client?->phone ?? '—'),
                        Forms\Components\Placeholder::make('client_cin')
                            ->content(fn ($record) => $record?->client?->cin ?? '—'),
                    ])->columns(2),

                Forms\Components\Section::make('Documents')
                    ->schema([
                        Forms\Components\Placeholder::make('cin_doc')
                            ->content(fn ($record) => $record?->client?->cin_image_url
                                ? '<a href="' . $record->client->cin_image_url . '" target="_blank" class="text-primary-600 underline">Voir CIN</a>'
                                : 'Aucun document CIN'),
                        Forms\Components\Placeholder::make('license_doc')
                            ->content(fn ($record) => $record?->client?->license_image_url
                                ? '<a href="' . $record->client->license_image_url . '" target="_blank" class="text-primary-600 underline">Voir Permis</a>'
                                : 'Aucun document Permis'),
                    ])->columns(2),

                Forms\Components\Section::make('Détails Réservation')
                    ->schema([
                        Forms\Components\Select::make('vehicle_id')
                            ->relationship('vehicle', 'plate')
                            ->required()
                            ->disabled(),
                        Forms\Components\DatePicker::make('start_date')
                            ->required()
                            ->disabled(),
                        Forms\Components\DatePicker::make('end_date')
                            ->required()
                            ->afterOrEqual('start_date')
                            ->disabled(),
                    ])->columns(3),

                Forms\Components\Section::make('Financials')
                    ->schema([
                        Forms\Components\TextInput::make('total_price')
                            ->required()
                            ->numeric()
                            ->prefix('MAD')
                            ->disabled(),
                        Forms\Components\TextInput::make('deposit_amount')
                            ->numeric()
                            ->prefix('MAD')
                            ->disabled(),
                        Forms\Components\Select::make('payment_method')
                            ->options([
                                'cash' => 'Cash',
                                'cmi' => 'CMI',
                                'transfer' => 'Virement',
                                'stripe' => 'Stripe',
                                'on_site' => 'Sur Place',
                            ])
                            ->disabled(),
                    ])->columns(3),

                Forms\Components\Section::make('Statut')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'En attente',
                                'pending_payment' => 'Attente paiement',
                                'pending_partner' => 'Attente partenaire',
                                'confirmed' => 'Confirmée',
                                'ongoing' => 'En cours',
                                'completed' => 'Terminée',
                                'cancelled' => 'Annulée',
                            ])
                            ->required(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Réf.')
                    ->formatStateUsing(fn ($state) => 'VRC-' . str_pad($state, 5, '0', STR_PAD_LEFT))
                    ->sortable(),

                Tables\Columns\TextColumn::make('client.name')
                    ->label('Client')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('vehicle.plate')
                    ->label('Véhicule')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_date')
                    ->label('Début')
                    ->date('d/m/Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->label('Fin')
                    ->date('d/m/Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_price')
                    ->label('Montant')
                    ->money('MAD')
                    ->sortable(),

                Tables\Columns\IconColumn::make('client.cin_image_url')
                    ->label('CIN')
                    ->boolean()
                    ->getStateUsing(fn ($record) => ! empty($record->client?->cin_image_url)),

                Tables\Columns\IconColumn::make('client.license_image_url')
                    ->label('Permis')
                    ->boolean()
                    ->getStateUsing(fn ($record) => ! empty($record->client?->license_image_url)),

                Tables\Columns\TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'pending_payment' => 'warning',
                        'pending_partner' => 'info',
                        'confirmed' => 'success',
                        'ongoing' => 'primary',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'En attente',
                        'pending_payment' => 'Attente paiement',
                        'pending_partner' => 'Attente partenaire',
                        'confirmed' => 'Confirmée',
                        'ongoing' => 'En cours',
                        'completed' => 'Terminée',
                        'cancelled' => 'Annulée',
                        default => $state,
                    }),
            ])
            ->defaultSort('id', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'pending' => 'En attente',
                        'pending_payment' => 'Attente paiement',
                        'pending_partner' => 'Attente partenaire',
                        'confirmed' => 'Confirmée',
                        'ongoing' => 'En cours',
                        'completed' => 'Terminée',
                        'cancelled' => 'Annulée',
                    ]),
                Tables\Filters\Filter::make('has_documents')
                    ->label('Avec documents')
                    ->query(fn ($query) => $query->whereHas('client', fn ($q) => $q->whereNotNull('cin_image_url'))),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),

                Tables\Actions\Action::make('confirm')
                    ->label('Confirmer')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Confirmer la réservation')
                    ->modalDescription('Le client sera notifié par SMS.')
                    ->visible(fn ($record) => in_array($record->status, ['pending', 'pending_payment'])),
                Tables\Actions\Action::make('cancel')
                    ->label('Annuler')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Annuler la réservation')
                    ->modalDescription('Êtes-vous sûr de vouloir annuler cette réservation ?')
                    ->form([
                        Forms\Components\Textarea::make('cancel_reason')
                            ->label('Motif d\'annulation')
                            ->required(),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update([
                            'status' => 'cancelled',
                            'documents' => array_merge($record->documents ?? [], ['cancel_reason' => $data['cancel_reason']]),
                        ]);

                        Notification::make()
                            ->title('Réservation annulée')
                            ->success()
                            ->send();
                    })
                    ->visible(fn ($record) => in_array($record->status, ['pending', 'pending_payment', 'confirmed', 'pending_partner'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReservations::route('/'),
            'create' => Pages\CreateReservation::route('/create'),
            'edit' => Pages\EditReservation::route('/{record}/edit'),
            'view' => Pages\ViewReservation::route('/{record}'),
        ];
    }
}
