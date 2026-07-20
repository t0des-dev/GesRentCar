<?php

namespace App\Filament\Resources\ReservationResource\Pages;

use App\Filament\Resources\ReservationResource;
use Filament\Actions;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ViewReservation extends ViewRecord
{
    protected static string $resource = ReservationResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Client')
                    ->schema([
                        TextEntry::make('client.name')
                            ->label('Nom')
                            ->weight('bold'),
                        TextEntry::make('client.email')
                            ->label('Email'),
                        TextEntry::make('client.phone')
                            ->label('Téléphone'),
                        TextEntry::make('client.cin')
                            ->label('CIN'),
                        TextEntry::make('client.license_number')
                            ->label('N° Permis'),
                    ])->columns(2),

                Section::make('Documents du Client')
                    ->schema([
                        TextEntry::make('client.cin_image_url')
                            ->label('CIN')
                            ->placeholder('Aucun document')
                            ->url(fn ($record) => $record->client?->cin_image_url ? $record->client->cin_image_url : null)
                            ->openUrlInNewTab(),
                        TextEntry::make('client.license_image_url')
                            ->label('Permis')
                            ->placeholder('Aucun document')
                            ->url(fn ($record) => $record->client?->license_image_url ? $record->client->license_image_url : null)
                            ->openUrlInNewTab(),
                    ])->columns(2),

                Section::make('Réservation')
                    ->schema([
                        TextEntry::make('id')
                            ->label('Référence')
                            ->formatStateUsing(fn ($state) => 'VRC-'.str_pad($state, 5, '0', STR_PAD_LEFT))
                            ->weight('bold'),
                        TextEntry::make('vehicle.plate')
                            ->label('Véhicule')
                            ->badge(),
                        TextEntry::make('start_date')
                            ->label('Date début')
                            ->dateTime('d/m/Y H:i'),
                        TextEntry::make('end_date')
                            ->label('Date fin')
                            ->dateTime('d/m/Y H:i'),
                        TextEntry::make('total_price')
                            ->label('Montant total')
                            ->money('MAD')
                            ->weight('bold'),
                        TextEntry::make('deposit_amount')
                            ->label('Acompte')
                            ->money('MAD'),
                        TextEntry::make('payment_method')
                            ->label('Paiement')
                            ->formatStateUsing(fn ($state) => match ($state) {
                                'cash' => 'Cash',
                                'cmi' => 'CMI',
                                'transfer' => 'Virement',
                                'stripe' => 'Stripe',
                                'on_site' => 'Sur Place',
                                default => $state ?? '—',
                            }),
                        TextEntry::make('status')
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
                    ])->columns(3),

                Section::make('Contrat')
                    ->schema([
                        TextEntry::make('contract.file_path')
                            ->label('Fichier')
                            ->placeholder('Aucun contrat généré')
                            ->url(fn ($record) => $record->contract ? '/api/reservations/'.$record->id.'/contract/file' : null)
                            ->openUrlInNewTab(),
                    ]),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make()
                ->label('Modifier'),

            Actions\Action::make('confirm')
                ->label('Confirmer')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Confirmer la réservation')
                ->modalDescription('Le client sera notifié par SMS.')
                ->visible(fn () => in_array($this->record->status, ['pending', 'pending_payment']))
                ->action(function (): void {
                    $this->record->update(['status' => 'confirmed']);
                    Notification::make()
                        ->title('Réservation confirmée')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('cancel')
                ->label('Annuler')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->modalHeading('Annuler la réservation')
                ->modalDescription('Êtes-vous sûr ?')
                ->visible(fn () => in_array($this->record->status, ['pending', 'pending_payment', 'confirmed', 'pending_partner']))
                ->action(function (): void {
                    $this->record->update(['status' => 'cancelled']);
                    Notification::make()
                        ->title('Réservation annulée')
                        ->success()
                        ->send();
                }),
        ];
    }
}
