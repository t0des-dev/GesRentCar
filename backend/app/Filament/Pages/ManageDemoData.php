<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use App\Models\Vehicle;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Maintenance;
use App\Models\Contract;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ManageDemoData extends Page
{
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-server-stack';

    protected string $view = 'filament.pages.manage-demo-data';

    protected static ?string $navigationLabel = 'Données de Démo';

    protected static ?string $title = 'Gestion des Données de Démo';

    protected static string|\UnitEnum|null $navigationGroup = 'Configuration';

    protected static ?int $navigationSort = 4;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('populate')
                ->label('Remplir la Flotte (Démo)')
                ->icon('heroicon-o-arrow-path')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Remplir les données démo ?')
                ->modalDescription('Cela va ajouter des véhicules, des clients, des réservations et des paiements de test à votre base de données.')
                ->action(fn () => $this->populateDemoData()),

            Action::make('clear')
                ->label('Vider les Données Démo')
                ->icon('heroicon-o-trash')
                ->color('danger')
                ->requiresConfirmation()
                ->modalHeading('Vider la base de données ?')
                ->modalDescription('Attention : Cette action va supprimer toutes les réservations, paiements, contrats, maintenances, dépenses, véhicules et clients de test. Cette action est irréversible.')
                ->action(fn () => $this->clearDemoData()),
        ];
    }

    public function getViewData(): array
    {
        return [
            'vehiclesCount' => Vehicle::count(),
            'clientsCount' => Client::count(),
            'reservationsCount' => Reservation::count(),
            'paymentsCount' => Payment::count(),
            'maintenancesCount' => Maintenance::count(),
            'expensesCount' => Expense::count(),
            'invoicesCount' => Invoice::count(),
            'contractsCount' => Contract::count(),
        ];
    }

    public function populateDemoData()
    {
        try {
            DB::transaction(function () {
                // 1. Create client users and demo clients
                // Let's create some clients
                $clients = [
                    [
                        'name' => 'Jean Dupont',
                        'email' => 'jean.dupont@email.com',
                        'phone' => '+33612345678',
                        'cin' => 'FR-JD-8877',
                        'license_number' => 'DL-FR-99881',
                        'cin_image_url' => 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=200',
                        'license_image_url' => 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=200',
                    ],
                    [
                        'name' => 'Sophie Martin',
                        'email' => 'sophie.martin@email.com',
                        'phone' => '+212600112233',
                        'cin' => 'MA-SM-4455',
                        'license_number' => 'DL-MA-22334',
                        'cin_image_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
                        'license_image_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
                    ],
                    [
                        'name' => 'John Smith',
                        'email' => 'john.smith@email.com',
                        'phone' => '+15550199228',
                        'cin' => 'US-JS-1122',
                        'license_number' => 'DL-US-88776',
                        'cin_image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
                        'license_image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
                    ]
                ];

                $createdClients = [];
                foreach ($clients as $clientData) {
                    $createdClients[] = Client::firstOrCreate(
                        ['email' => $clientData['email']],
                        $clientData
                    );
                }

                // 2. Create some premium vehicles
                $vehicles = [
                    [
                        'brand' => 'Mercedes-Benz',
                        'model' => 'Classe G 63 AMG',
                        'plate' => '12345-A-1',
                        'price_per_day' => 2500.00,
                        'mileage' => 12000,
                        'status' => 'available',
                        'type' => 'internal',
                        'category' => 'luxury',
                        'transmission' => 'automatique',
                        'fuel_type' => 'diesel',
                        'year' => 2024,
                        'color' => '#000000',
                        'seats' => 5,
                        'image_url' => 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?q=80&w=600',
                        'insurance_date' => now()->addMonths(6),
                        'tech_inspection_date' => now()->addMonths(10),
                        'vignette_date' => now()->addMonths(3),
                    ],
                    [
                        'brand' => 'Land Rover',
                        'model' => 'Range Rover Sport',
                        'plate' => '67890-B-26',
                        'price_per_day' => 1800.00,
                        'mileage' => 24000,
                        'status' => 'rented',
                        'type' => 'internal',
                        'category' => 'luxury',
                        'transmission' => 'automatique',
                        'fuel_type' => 'diesel',
                        'year' => 2023,
                        'color' => '#ffffff',
                        'seats' => 5,
                        'image_url' => 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=600',
                        'insurance_date' => now()->addMonths(3),
                        'tech_inspection_date' => now()->addMonths(8),
                        'vignette_date' => now()->addMonths(2),
                    ],
                    [
                        'brand' => 'Porsche',
                        'model' => '911 Carrera S',
                        'plate' => '54321-C-8',
                        'price_per_day' => 3000.00,
                        'mileage' => 8500,
                        'status' => 'available',
                        'type' => 'internal',
                        'category' => 'luxury',
                        'transmission' => 'automatique',
                        'fuel_type' => 'essence',
                        'year' => 2024,
                        'color' => '#ff0000',
                        'seats' => 4,
                        'image_url' => 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600',
                        'insurance_date' => now()->addMonths(5),
                        'tech_inspection_date' => now()->addMonths(11),
                        'vignette_date' => now()->addMonths(1),
                    ],
                    [
                        'brand' => 'Audi',
                        'model' => 'RS6 Avant',
                        'plate' => '98765-D-15',
                        'price_per_day' => 2200.00,
                        'mileage' => 15000,
                        'status' => 'available',
                        'type' => 'internal',
                        'category' => 'luxury',
                        'transmission' => 'automatique',
                        'fuel_type' => 'essence',
                        'year' => 2023,
                        'color' => '#333333',
                        'seats' => 5,
                        'image_url' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600',
                        'insurance_date' => now()->addMonths(8),
                        'tech_inspection_date' => now()->addMonths(9),
                        'vignette_date' => now()->addMonths(4),
                    ],
                    [
                        'brand' => 'Volkswagen',
                        'model' => 'Golf 8 R',
                        'plate' => '13579-E-6',
                        'price_per_day' => 800.00,
                        'mileage' => 32000,
                        'status' => 'maintenance',
                        'type' => 'collaborator',
                        'commission_rate' => 15.00,
                        'category' => 'economy',
                        'transmission' => 'automatique',
                        'fuel_type' => 'essence',
                        'year' => 2022,
                        'color' => '#0000ff',
                        'seats' => 5,
                        'image_url' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600',
                        'insurance_date' => now()->addMonths(2),
                        'tech_inspection_date' => now()->addMonths(4),
                        'vignette_date' => now()->addMonths(6),
                    ],
                    [
                        'brand' => 'Dacia',
                        'model' => 'Duster Prestige',
                        'plate' => '24680-F-26',
                        'price_per_day' => 350.00,
                        'mileage' => 45000,
                        'status' => 'available',
                        'type' => 'internal',
                        'category' => 'economy',
                        'transmission' => 'manuelle',
                        'fuel_type' => 'diesel',
                        'year' => 2021,
                        'color' => '#8b5a2b',
                        'seats' => 5,
                        'image_url' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600',
                        'insurance_date' => now()->addMonths(1),
                        'tech_inspection_date' => now()->addMonths(5),
                        'vignette_date' => now()->addMonths(10),
                    ]
                ];

                $createdVehicles = [];
                foreach ($vehicles as $vehicleData) {
                    $createdVehicles[] = Vehicle::firstOrCreate(
                        ['plate' => $vehicleData['plate']],
                        $vehicleData
                    );
                }

                // 3. Create some demo reservations
                if (count($createdClients) > 0 && count($createdVehicles) > 0) {
                    $reservationData = [
                        [
                            'client_id' => $createdClients[0]->id, // Jean Dupont
                            'vehicle_id' => $createdVehicles[1]->id, // Range Rover (rented)
                            'start_date' => now()->subDays(2),
                            'end_date' => now()->addDays(5),
                            'status' => 'active',
                            'total_price' => $createdVehicles[1]->price_per_day * 7,
                            'deposit_amount' => 5000.00,
                            'payment_method' => 'cash',
                        ],
                        [
                            'client_id' => $createdClients[1]->id, // Sophie Martin
                            'vehicle_id' => $createdVehicles[0]->id, // G-Class
                            'start_date' => now()->addDays(2),
                            'end_date' => now()->addDays(6),
                            'status' => 'confirmed',
                            'total_price' => $createdVehicles[0]->price_per_day * 4,
                            'deposit_amount' => 10000.00,
                            'payment_method' => 'stripe',
                        ],
                        [
                            'client_id' => $createdClients[2]->id, // John Smith
                            'vehicle_id' => $createdVehicles[2]->id, // Porsche
                            'start_date' => now()->subDays(15),
                            'end_date' => now()->subDays(10),
                            'status' => 'completed',
                            'total_price' => $createdVehicles[2]->price_per_day * 5,
                            'deposit_amount' => 15000.00,
                            'payment_method' => 'stripe',
                        ],
                    ];

                    foreach ($reservationData as $resData) {
                        $res = Reservation::create($resData);

                        // Also create payment for it
                        Payment::create([
                            'reservation_id' => $res->id,
                            'paid_amount' => $res->total_price,
                            'remaining' => 0.00,
                            'status' => 'completed',
                            'payment_method' => $res->payment_method,
                            'type' => 'full',
                            'transaction_id' => 'TXN_' . str_pad($res->id, 8, '0', STR_PAD_LEFT),
                        ]);

                        // Generate a demo contract if completed or active
                        if (in_array($res->status, ['active', 'completed'])) {
                            Contract::create([
                                'reservation_id' => $res->id,
                                'file_path' => 'contracts/contract_' . $res->id . '.pdf',
                                'signed_at' => now()->subDays(2),
                            ]);
                        }
                    }
                }

                // 4. Create maintenance records
                if (count($createdVehicles) > 4) {
                    Maintenance::create([
                        'vehicle_id' => $createdVehicles[4]->id, // Golf 8 R
                        'type' => 'oil',
                        'next_due' => now()->addMonths(2)->format('Y-m-d'),
                        'status' => 'pending',
                    ]);
                }
            });

            Notification::make()
                ->title('Flotte et données démo initialisées avec succès !')
                ->success()
                ->send();

        } catch (\Exception $e) {
            Notification::make()
                ->title('Erreur lors de l\'initialisation : ' . $e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function clearDemoData()
    {
        try {
            DB::transaction(function () {
                // Delete in correct order to avoid constraint issues
                Contract::query()->delete();
                Payment::query()->delete();
                Invoice::query()->delete();
                Reservation::query()->delete();
                Maintenance::query()->delete();
                Expense::query()->delete();
                Vehicle::query()->delete();
                Client::query()->delete();
                ActivityLog::query()->delete();

                // Clear client role users from User table, keep admin & agent
                User::where('role', 'client')->delete();
            });

            Notification::make()
                ->title('Toutes les données de démo ont été vidées avec succès !')
                ->success()
                ->send();

        } catch (\Exception $e) {
            Notification::make()
                ->title('Erreur lors de la suppression : ' . $e->getMessage())
                ->danger()
                ->send();
        }
    }
}
