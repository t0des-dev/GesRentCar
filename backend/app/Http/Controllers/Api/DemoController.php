<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\LoyaltyPoint;
use App\Models\Maintenance;
use App\Models\Payment;
use App\Models\PromoCode;
use App\Models\Referral;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\User;
use App\Models\UserLoyaltyProfile;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'vehicles'         => Vehicle::count(),
            'clients'          => Client::count(),
            'reservations'     => Reservation::count(),
            'payments'         => Payment::count(),
            'maintenances'     => Maintenance::count(),
            'expenses'         => Expense::count(),
            'invoices'         => Invoice::count(),
            'contracts'        => Contract::count(),
            'reviews'          => Review::count(),
            'promo_codes'      => PromoCode::count(),
            'loyalty_profiles' => UserLoyaltyProfile::count(),
        ]);
    }

    public function populate(): JsonResponse
    {
        try {
            $types = request()->input('types', []);
            $types = is_array($types) ? array_map('strtolower', $types) : [];
            $populateAll = empty($types);

            DB::transaction(function () use ($types, $populateAll) {
                // --- Vehicles ---
                if ($populateAll || in_array('vehicles', $types)) {
                    $vehicles = $this->getVehicleData();
                    $createdVehicles = [];
                    foreach ($vehicles as $data) {
                        $v = Vehicle::withTrashed()->updateOrCreate(['plate' => $data['plate']], $data);
                        if ($v->trashed()) {
                            $v->restore();
                        }
                        $createdVehicles[$data['plate']] = $v;
                    }
                } else {
                    $createdVehicles = [];
                    foreach (Vehicle::withTrashed()->get() as $v) {
                        $createdVehicles[$v->plate] = $v;
                    }
                }

                // --- Clients ---
                if ($populateAll || in_array('clients', $types)) {
                    $clients = $this->getClientData();
                    $createdClients = [];
                    foreach ($clients as $data) {
                        $c = Client::firstOrCreate(['email' => $data['email']], $data);
                        $createdClients[$data['email']] = $c;
                    }
                } else {
                    $createdClients = [];
                    foreach (Client::all() as $c) {
                        $createdClients[$c->email] = $c;
                    }
                }

                // --- Users for reviews/loyalty (create simple client users) ---
                if ($populateAll || in_array('reviews', $types) || in_array('loyalty', $types)) {
                    $userEmails = [
                        'jean.dupont@email.com'     => 'Jean Dupont',
                        'sophie.martin@email.com'    => 'Sophie Martin',
                        'john.smith@email.com'       => 'John Smith',
                        'ahmed.elfassi@gmail.com'    => 'Ahmed El Fassi',
                        'marie.leclerc@email.fr'     => 'Marie Leclerc',
                        'youssef.benali@outlook.com' => 'Youssef Benali',
                        'giovanni.rossi@email.it'    => 'Giovanni Rossi',
                    ];
                    $createdUsers = [];
                    foreach ($userEmails as $email => $name) {
                        $createdUsers[$email] = User::firstOrCreate(
                            ['email' => $email],
                            ['name' => $name, 'password' => Hash::make('password'), 'role' => 'client']
                        );
                    }
                }

                // --- Reservations ---
                $reservations = [];
                if ($populateAll || in_array('reservations', $types)) {
                    $resData = $this->getReservationData($createdClients, $createdVehicles);
                    foreach ($resData as $data) {
                        $res = Reservation::updateOrCreate(
                            ['client_id' => $data['client_id'], 'vehicle_id' => $data['vehicle_id'], 'start_date' => $data['start_date']],
                            $data
                        );
                        $reservations[$res->id] = $res;
                    }
                } else {
                    foreach (Reservation::all() as $r) {
                        $reservations[$r->id] = $r;
                    }
                }

                // --- Payments ---
                if ($populateAll || in_array('payments', $types)) {
                    $this->createPayments($reservations);
                }

                // --- Contracts ---
                if ($populateAll || in_array('reservations', $types)) {
                    $this->createContracts($reservations);
                }

                // --- Maintenance ---
                if ($populateAll || in_array('maintenances', $types)) {
                    $this->createMaintenance($createdVehicles);
                }

                // --- Invoices ---
                if ($populateAll || in_array('invoices', $types)) {
                    $this->createInvoices($reservations);
                }

                // --- Expenses ---
                if ($populateAll || in_array('expenses', $types)) {
                    $this->createExpenses($createdVehicles);
                }

                // --- Reviews ---
                if ($populateAll || in_array('reviews', $types)) {
                    $this->createReviews($createdUsers, $createdVehicles, $reservations);
                }

                // --- Promo Codes ---
                if ($populateAll || in_array('promo_codes', $types)) {
                    $this->createPromoCodes();
                }

                // --- Loyalty ---
                if ($populateAll || in_array('loyalty', $types)) {
                    $this->createLoyalty($createdUsers);
                }

                // --- Activity Logs ---
                if ($populateAll || in_array('activity_logs', $types)) {
                    $this->createActivityLogs();
                }
            });

            return response()->json(['message' => 'Données démo initialisées avec succès !']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur : ' . $e->getMessage()], 500);
        }
    }

    public function clear(): JsonResponse
    {
        try {
            DB::transaction(function () {
                Review::query()->delete();
                PromoCode::query()->delete();
                UserLoyaltyProfile::query()->delete();
                LoyaltyPoint::query()->delete();
                Referral::query()->delete();
                Contract::query()->delete();
                Payment::query()->delete();
                Invoice::query()->delete();
                Reservation::query()->delete();
                Maintenance::query()->delete();
                Expense::query()->delete();
                ActivityLog::query()->delete();
                Vehicle::query()->delete();
                Client::query()->delete();
                User::where('role', 'client')->delete();
            });

            return response()->json(['message' => 'Toutes les données de démo ont été supprimées avec succès !']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur : ' . $e->getMessage()], 500);
        }
    }

    private function getVehicleData(): array
    {
        return [
            [
                'brand'                => 'Mercedes-Benz',
                'model'                => 'Classe G 63 AMG',
                'plate'                => '10001-X-01',
                'price_per_day'        => 2500.00,
                'mileage'              => 12000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'luxury',
                'transmission'         => 'automatique',
                'fuel_type'            => 'diesel',
                'year'                 => 2024,
                'color'                => '#000000',
                'seats'                => 5,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?q=80&w=600',
                'insurance_date'       => now()->addMonths(6),
                'tech_inspection_date' => now()->addMonths(10),
                'vignette_date'        => now()->addMonths(3),
            ],
            [
                'brand'                => 'Porsche',
                'model'                => '911 Carrera S',
                'plate'                => '20002-X-02',
                'price_per_day'        => 3000.00,
                'mileage'              => 8500,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'luxury',
                'transmission'         => 'automatique',
                'fuel_type'            => 'essence',
                'year'                 => 2024,
                'color'                => '#ff0000',
                'seats'                => 4,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600',
                'insurance_date'       => now()->addMonths(5),
                'tech_inspection_date' => now()->addMonths(11),
                'vignette_date'        => now()->addMonths(1),
            ],
            [
                'brand'                => 'BMW',
                'model'                => 'X5 M Sport',
                'plate'                => '30003-X-03',
                'price_per_day'        => 1600.00,
                'mileage'              => 22000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'suv',
                'transmission'         => 'automatique',
                'fuel_type'            => 'diesel',
                'year'                 => 2023,
                'color'                => '#ffffff',
                'seats'                => 5,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600',
                'insurance_date'       => now()->addMonths(8),
                'tech_inspection_date' => now()->addMonths(4),
                'vignette_date'        => now()->addMonths(6),
            ],
            [
                'brand'                => 'Toyota',
                'model'                => 'RAV4 Hybrid',
                'plate'                => '40004-X-04',
                'price_per_day'        => 900.00,
                'mileage'              => 18000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'suv',
                'transmission'         => 'automatique',
                'fuel_type'            => 'hybrid',
                'year'                 => 2024,
                'color'                => '#c0c0c0',
                'seats'                => 5,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1568844293986-8d0400f4745b?q=80&w=600',
                'insurance_date'       => now()->addMonths(7),
                'tech_inspection_date' => now()->addMonths(9),
                'vignette_date'        => now()->addMonths(5),
            ],
            [
                'brand'                => 'Ford',
                'model'                => 'Mustang GT',
                'plate'                => '50005-X-05',
                'price_per_day'        => 2000.00,
                'mileage'              => 15000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'sport',
                'transmission'         => 'automatique',
                'fuel_type'            => 'essence',
                'year'                 => 2023,
                'color'                => '#0000ff',
                'seats'                => 4,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600',
                'insurance_date'       => now()->addMonths(4),
                'tech_inspection_date' => now()->addMonths(7),
                'vignette_date'        => now()->addMonths(2),
            ],
            [
                'brand'                => 'Tesla',
                'model'                => 'Model 3',
                'plate'                => '60006-X-06',
                'price_per_day'        => 1200.00,
                'mileage'              => 10000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'eco',
                'transmission'         => 'automatique',
                'fuel_type'            => 'electric',
                'year'                 => 2024,
                'color'                => '#ffffff',
                'seats'                => 5,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600',
                'insurance_date'       => now()->addMonths(9),
                'tech_inspection_date' => now()->addMonths(12),
                'vignette_date'        => now()->addMonths(8),
            ],
            [
                'brand'                => 'Renault',
                'model'                => 'Clio V',
                'plate'                => '70007-X-07',
                'price_per_day'        => 350.00,
                'mileage'              => 35000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'economy',
                'transmission'         => 'manuelle',
                'fuel_type'            => 'essence',
                'year'                 => 2022,
                'color'                => '#ff0000',
                'seats'                => 5,
                'gps'                  => false,
                'air_conditioning'     => false,
                'image_url'            => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0aba?q=80&w=600',
                'insurance_date'       => now()->addMonths(2),
                'tech_inspection_date' => now()->addMonths(5),
                'vignette_date'        => now()->addMonths(1),
            ],
            [
                'brand'                => 'Dacia',
                'model'                => 'Logan',
                'plate'                => '80008-X-08',
                'price_per_day'        => 250.00,
                'mileage'              => 45000,
                'status'               => 'available',
                'type'                 => 'internal',
                'category'             => 'economy',
                'transmission'         => 'manuelle',
                'fuel_type'            => 'diesel',
                'year'                 => 2021,
                'color'                => '#ffffff',
                'seats'                => 5,
                'gps'                  => false,
                'air_conditioning'     => false,
                'image_url'            => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600',
                'insurance_date'       => now()->addMonths(1),
                'tech_inspection_date' => now()->addMonths(3),
                'vignette_date'        => now()->addMonths(10),
            ],
            [
                'brand'                => 'Volkswagen',
                'model'                => 'Golf 8 R',
                'plate'                => '90009-X-09',
                'price_per_day'        => 800.00,
                'mileage'              => 32000,
                'status'               => 'maintenance',
                'type'                 => 'collaborator',
                'commission_rate'      => 15.00,
                'category'             => 'standard',
                'transmission'         => 'automatique',
                'fuel_type'            => 'essence',
                'year'                 => 2022,
                'color'                => '#0000ff',
                'seats'                => 5,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600',
                'insurance_date'       => now()->addMonths(3),
                'tech_inspection_date' => now()->addMonths(1),
                'vignette_date'        => now()->addMonths(4),
            ],
            [
                'brand'                => 'Mercedes-Benz',
                'model'                => 'Classe V',
                'plate'                => '10010-X-10',
                'price_per_day'        => 1800.00,
                'mileage'              => 28000,
                'status'               => 'available',
                'type'                 => 'collaborator',
                'commission_rate'      => 12.00,
                'category'             => 'luxury',
                'transmission'         => 'automatique',
                'fuel_type'            => 'diesel',
                'year'                 => 2023,
                'color'                => '#000000',
                'seats'                => 8,
                'gps'                  => true,
                'air_conditioning'     => true,
                'image_url'            => 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=600',
                'insurance_date'       => now()->addMonths(7),
                'tech_inspection_date' => now()->addMonths(8),
                'vignette_date'        => now()->addMonths(5),
            ],
        ];
    }

    private function getClientData(): array
    {
        return [
            [
                'name'              => 'Jean Dupont',
                'email'             => 'jean.dupont@email.com',
                'phone'             => '+33612345678',
                'cin'               => 'FR-JD-8877',
                'license_number'    => 'DL-FR-99881',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=200',
            ],
            [
                'name'              => 'Sophie Martin',
                'email'             => 'sophie.martin@email.com',
                'phone'             => '+212600112233',
                'cin'               => 'MA-SM-4455',
                'license_number'    => 'DL-MA-22334',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
            ],
            [
                'name'              => 'John Smith',
                'email'             => 'john.smith@email.com',
                'phone'             => '+15550199228',
                'cin'               => 'US-JS-1122',
                'license_number'    => 'DL-US-88776',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
            ],
            [
                'name'              => 'Ahmed El Fassi',
                'email'             => 'ahmed.elfassi@gmail.com',
                'phone'             => '+212661234567',
                'cin'               => 'MA-AE-7788',
                'license_number'    => 'DL-MA-55667',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
            ],
            [
                'name'              => 'Marie Leclerc',
                'email'             => 'marie.leclerc@email.fr',
                'phone'             => '+33698765432',
                'cin'               => 'FR-ML-3344',
                'license_number'    => 'DL-FR-11223',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
            ],
            [
                'name'              => 'Youssef Benali',
                'email'             => 'youssef.benali@outlook.com',
                'phone'             => '+212672345678',
                'cin'               => 'MA-YB-5566',
                'license_number'    => 'DL-MA-77889',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
            ],
            [
                'name'              => 'Vectoria Entreprises',
                'email'             => 'corporate@vectoria.ma',
                'phone'             => '+212522001122',
                'cin'               => 'MA-VE-0011',
                'license_number'    => 'DL-MA-99001',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=200',
            ],
            [
                'name'              => 'Giovanni Rossi',
                'email'             => 'giovanni.rossi@email.it',
                'phone'             => '+393331234567',
                'cin'               => 'IT-GR-9900',
                'license_number'    => 'DL-IT-44556',
                'cin_image_url'     => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
                'license_image_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
            ],
        ];
    }

    private function getReservationData(array $clients, array $vehicles): array
    {
        return [
            [
                'client_id'      => $clients['jean.dupont@email.com']->id,
                'vehicle_id'     => $vehicles['30003-X-03']->id,
                'start_date'     => now()->subDays(2),
                'end_date'       => now()->addDays(5),
                'status'         => 'active',
                'total_price'    => 1600 * 7,
                'deposit_amount' => 5000.00,
                'payment_method' => 'cash',
            ],
            [
                'client_id'      => $clients['sophie.martin@email.com']->id,
                'vehicle_id'     => $vehicles['10001-X-01']->id,
                'start_date'     => now()->addDays(2),
                'end_date'       => now()->addDays(6),
                'status'         => 'confirmed',
                'total_price'    => 2500 * 4,
                'deposit_amount' => 10000.00,
                'payment_method' => 'stripe',
            ],
            [
                'client_id'      => $clients['john.smith@email.com']->id,
                'vehicle_id'     => $vehicles['20002-X-02']->id,
                'start_date'     => now()->subDays(15),
                'end_date'       => now()->subDays(10),
                'status'         => 'completed',
                'total_price'    => 3000 * 5,
                'deposit_amount' => 15000.00,
                'payment_method' => 'stripe',
            ],
            [
                'client_id'      => $clients['ahmed.elfassi@gmail.com']->id,
                'vehicle_id'     => $vehicles['60006-X-06']->id,
                'start_date'     => now()->subDay(),
                'end_date'       => now()->addDays(3),
                'status'         => 'ongoing',
                'total_price'    => 1200 * 4,
                'deposit_amount' => 2000.00,
                'payment_method' => 'cash',
            ],
            [
                'client_id'      => $clients['marie.leclerc@email.fr']->id,
                'vehicle_id'     => $vehicles['50005-X-05']->id,
                'start_date'     => now()->addDays(3),
                'end_date'       => now()->addDays(7),
                'status'         => 'pending',
                'total_price'    => 2000 * 4,
                'deposit_amount' => 0.00,
                'payment_method' => 'cash',
            ],
            [
                'client_id'      => $clients['youssef.benali@outlook.com']->id,
                'vehicle_id'     => $vehicles['40004-X-04']->id,
                'start_date'     => now()->addDay(),
                'end_date'       => now()->addDays(4),
                'status'         => 'pending_payment',
                'total_price'    => 900 * 3,
                'deposit_amount' => 1000.00,
                'payment_method' => 'stripe',
            ],
            [
                'client_id'      => $clients['corporate@vectoria.ma']->id,
                'vehicle_id'     => $vehicles['10010-X-10']->id,
                'start_date'     => now()->addDays(5),
                'end_date'       => now()->addDays(10),
                'status'         => 'confirmed',
                'total_price'    => 1800 * 5,
                'deposit_amount' => 4500.00,
                'payment_method' => 'cash',
            ],
            [
                'client_id'      => $clients['giovanni.rossi@email.it']->id,
                'vehicle_id'     => $vehicles['70007-X-07']->id,
                'start_date'     => now()->subDays(20),
                'end_date'       => now()->subDays(15),
                'status'         => 'cancelled',
                'total_price'    => 350 * 5,
                'deposit_amount' => 0.00,
                'payment_method' => 'cash',
            ],
        ];
    }

    private function createPayments(array $reservations): void
    {
        foreach ($reservations as $res) {
            if ($res->deposit_amount <= 0) {
                continue;
            }

            $completedStatuses = ['active', 'confirmed', 'ongoing', 'completed'];

            Payment::updateOrCreate(
                ['reservation_id' => $res->id],
                [
                    'paid_amount'    => $res->deposit_amount,
                    'remaining'      => $res->total_price - $res->deposit_amount,
                    'status'         => in_array($res->status, $completedStatuses) ? 'completed' : 'pending',
                    'payment_method' => $res->payment_method,
                    'type'           => 'deposit',
                    'transaction_id' => 'TXN_' . str_pad($res->id, 8, '0', STR_PAD_LEFT),
                ]
            );
        }
    }

    private function createContracts(array $reservations): void
    {
        $contractStatuses = ['active', 'confirmed', 'ongoing', 'completed'];

        foreach ($reservations as $res) {
            if (! in_array($res->status, $contractStatuses)) {
                continue;
            }

            $signedAt = match ($res->status) {
                'completed' => now()->subDays(2),
                'active', 'ongoing' => now(),
                default => null,
            };

            Contract::updateOrCreate(
                ['reservation_id' => $res->id],
                [
                    'file_path' => 'contracts/contract_' . $res->id . '.pdf',
                    'signed_at' => $signedAt,
                ]
            );
        }
    }

    private function createMaintenance(array $vehicles): void
    {
        $maintenanceData = [
            ['plate' => '30003-X-03', 'type' => 'oil',        'status' => 'pending',   'next_due' => now()->addMonths(2)],
            ['plate' => '60006-X-06', 'type' => 'tires',      'status' => 'completed', 'next_due' => now()->subMonth()],
            ['plate' => '70007-X-07', 'type' => 'insurance',   'status' => 'overdue',   'next_due' => now()->subDays(15)],
            ['plate' => '90009-X-09', 'type' => 'tech_visit', 'status' => 'pending',   'next_due' => now()->addMonth()],
        ];

        foreach ($maintenanceData as $data) {
            if (! isset($vehicles[$data['plate']])) {
                continue;
            }
            Maintenance::updateOrCreate(
                ['vehicle_id' => $vehicles[$data['plate']]->id, 'type' => $data['type']],
                ['next_due' => $data['next_due'], 'status' => $data['status']]
            );
        }
    }

    private function createInvoices(array $reservations): void
    {
        $completedRes = null;
        $activeRes = null;
        $ongoingRes = null;

        foreach ($reservations as $res) {
            if ($res->status === 'completed') {
                $completedRes = $res;
            } elseif ($res->status === 'active') {
                $activeRes = $res;
            } elseif ($res->status === 'ongoing') {
                $ongoingRes = $res;
            }
        }

        if ($completedRes) {
            Invoice::updateOrCreate(
                ['reservation_id' => $completedRes->id],
                [
                    'invoice_number'  => 'FAC-202606-00001',
                    'subtotal_ht'     => 12500.00,
                    'vat_rate'        => 20.00,
                    'vat_amount'      => 2500.00,
                    'total_ttc'       => 15000.00,
                    'deposit_amount'  => 15000.00,
                    'remaining_amount'=> 0.00,
                    'status'          => 'paid',
                    'issued_at'       => now()->subDays(15),
                    'due_at'          => now()->subDays(10),
                    'paid_at'         => now()->subDays(10),
                ]
            );
        }

        if ($activeRes) {
            Invoice::updateOrCreate(
                ['reservation_id' => $activeRes->id],
                [
                    'invoice_number'  => 'FAC-202607-00002',
                    'subtotal_ht'     => 9333.00,
                    'vat_rate'        => 20.00,
                    'vat_amount'      => 1867.00,
                    'total_ttc'       => 11200.00,
                    'deposit_amount'  => 5000.00,
                    'remaining_amount'=> 6200.00,
                    'status'          => 'sent',
                    'issued_at'       => now(),
                    'due_at'          => now()->addDays(30),
                    'paid_at'         => null,
                ]
            );
        }

        if ($ongoingRes) {
            Invoice::updateOrCreate(
                ['reservation_id' => $ongoingRes->id],
                [
                    'invoice_number'  => 'FAC-202607-00003',
                    'subtotal_ht'     => 4000.00,
                    'vat_rate'        => 20.00,
                    'vat_amount'      => 800.00,
                    'total_ttc'       => 4800.00,
                    'deposit_amount'  => 2000.00,
                    'remaining_amount'=> 2800.00,
                    'status'          => 'draft',
                    'issued_at'       => null,
                    'due_at'          => null,
                    'paid_at'         => null,
                ]
            );
        }
    }

    private function createExpenses(array $vehicles): void
    {
        $expenses = [
            [
                'plate'        => '30003-X-03',
                'title'        => 'Carburant BMW X5',
                'amount'       => 800.00,
                'category'     => 'fuel',
                'expense_date' => now()->subDays(7),
            ],
            [
                'plate'        => '70007-X-07',
                'title'        => 'Vidange Renault Clio',
                'amount'       => 350.00,
                'category'     => 'maintenance',
                'expense_date' => now()->subDays(30),
            ],
            [
                'plate'        => '20002-X-02',
                'title'        => 'Assurance Porsche 911',
                'amount'       => 2500.00,
                'category'     => 'insurance',
                'expense_date' => now()->subDays(60),
            ],
            [
                'plate'        => null,
                'title'        => 'Péage Casa-Rabat',
                'amount'       => 120.00,
                'category'     => 'toll',
                'expense_date' => now()->subDays(3),
            ],
        ];

        foreach ($expenses as $data) {
            $vehicleId = isset($data['plate'], $vehicles[$data['plate']]) ? $vehicles[$data['plate']]->id : null;

            Expense::updateOrCreate(
                ['vehicle_id' => $vehicleId, 'title' => $data['title'], 'expense_date' => $data['expense_date']],
                [
                    'amount'    => $data['amount'],
                    'category'  => $data['category'],
                ]
            );
        }
    }

    private function createReviews(array $users, array $vehicles, array $reservations): void
    {
        $reviews = [
            [
                'email'        => 'john.smith@email.com',
                'plate'        => '20002-X-02',
                'rating'       => 5,
                'title'        => 'Expérience incroyable',
                'cleanliness'  => 5,
                'performance'  => 5,
                'value'        => 5,
                'is_approved'  => true,
            ],
            [
                'email'        => 'jean.dupont@email.com',
                'plate'        => '30003-X-03',
                'rating'       => 4,
                'title'        => 'Très bon SUV',
                'cleanliness'  => 4,
                'performance'  => 4,
                'value'        => 4,
                'is_approved'  => true,
            ],
            [
                'email'        => 'ahmed.elfassi@gmail.com',
                'plate'        => '60006-X-06',
                'rating'       => 5,
                'title'        => 'Futuriste et confortable',
                'cleanliness'  => 5,
                'performance'  => 5,
                'value'        => 4,
                'is_approved'  => true,
            ],
            [
                'email'        => 'sophie.martin@email.com',
                'plate'        => '80008-X-08',
                'rating'       => 3,
                'title'        => 'Correct pour le prix',
                'cleanliness'  => 3,
                'performance'  => 3,
                'value'        => 4,
                'is_approved'  => false,
            ],
            [
                'email'        => 'marie.leclerc@email.fr',
                'plate'        => '90009-X-09',
                'rating'       => 4,
                'title'        => 'Bonne sportivité',
                'cleanliness'  => 4,
                'performance'  => 5,
                'value'        => 3,
                'is_approved'  => true,
            ],
        ];

        foreach ($reviews as $data) {
            if (! isset($users[$data['email']]) || ! isset($vehicles[$data['plate']])) {
                continue;
            }

            $reservation = Reservation::where('client_id', $users[$data['email']]->id)
                ->where('vehicle_id', $vehicles[$data['plate']]->id)
                ->first();

            Review::updateOrCreate(
                ['vehicle_id' => $vehicles[$data['plate']]->id, 'user_id' => $users[$data['email']]->id],
                [
                    'reservation_id' => $reservation?->id,
                    'rating'         => $data['rating'],
                    'title'          => $data['title'],
                    'cleanliness'    => $data['cleanliness'],
                    'performance'    => $data['performance'],
                    'value_for_money'=> $data['value'],
                    'is_approved'    => $data['is_approved'],
                ]
            );
        }
    }

    private function createPromoCodes(): void
    {
        PromoCode::updateOrCreate(
            ['code' => 'WELCOME10'],
            [
                'type'       => 'percent',
                'value'      => 10.00,
                'max_uses'   => 100,
                'used_count' => 3,
                'expires_at' => now()->addMonths(3),
                'active'     => true,
            ]
        );

        PromoCode::updateOrCreate(
            ['code' => 'SUMMER500'],
            [
                'type'       => 'fixed',
                'value'      => 500.00,
                'max_uses'   => 50,
                'used_count' => 1,
                'expires_at' => now()->addMonths(2),
                'active'     => true,
            ]
        );
    }

    private function createLoyalty(array $users): void
    {
        if (! isset($users['ahmed.elfassi@gmail.com'], $users['jean.dupont@email.com'])) {
            return;
        }

        $ahmed = $users['ahmed.elfassi@gmail.com'];
        $jean  = $users['jean.dupont@email.com'];

        UserLoyaltyProfile::updateOrCreate(
            ['user_id' => $ahmed->id],
            ['total_points' => 480, 'available_points' => 380, 'tier' => 'bronze']
        );

        UserLoyaltyProfile::updateOrCreate(
            ['user_id' => $jean->id],
            ['total_points' => 1120, 'available_points' => 1000, 'tier' => 'silver']
        );

        $ahmedRes = Reservation::where('client_id', $ahmed->id)->first();
        $jeanRes  = Reservation::where('client_id', $jean->id)->first();

        LoyaltyPoint::updateOrCreate(
            ['user_id' => $ahmed->id, 'description' => 'Réservation #' . ($ahmedRes?->id ?? 0)],
            ['points' => 480, 'type' => 'earned', 'reservation_id' => $ahmedRes?->id]
        );

        LoyaltyPoint::updateOrCreate(
            ['user_id' => $jean->id, 'description' => 'Réservation #' . ($jeanRes?->id ?? 0)],
            ['points' => 1120, 'type' => 'earned', 'reservation_id' => $jeanRes?->id]
        );
    }

    private function createActivityLogs(): void
    {
        $logs = [
            ['action' => 'created',   'model_type' => Vehicle::class,    'model_id' => 1,   'details' => 'Created Mercedes G63'],
            ['action' => 'created',   'model_type' => Client::class,     'model_id' => 1,   'details' => 'Created Jean Dupont'],
            ['action' => 'updated',   'model_type' => Reservation::class,'model_id' => 1,   'details' => 'Confirmed reservation'],
            ['action' => 'populated', 'model_type' => null,              'model_id' => null, 'details' => 'Demo data populated'],
            ['action' => 'completed', 'model_type' => Reservation::class,'model_id' => 3,   'details' => 'Reservation completed'],
        ];

        foreach ($logs as $data) {
            ActivityLog::create([
                'user_id'     => null,
                'action'      => $data['action'],
                'model_type'  => $data['model_type'] ? class_basename($data['model_type']) : null,
                'model_id'    => $data['model_id'],
                'details'     => $data['details'],
                'ip_address'  => '127.0.0.1',
            ]);
        }
    }
}
