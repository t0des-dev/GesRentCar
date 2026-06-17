<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    // ─── Export réservations (CSV basique) ────────────────────────────────────
    public function reservations(Request $request)
    {
        $query = Reservation::with(['client:id,name,email,phone', 'vehicle:id,brand,model,plate'])
            ->select('id', 'client_id', 'vehicle_id', 'start_date', 'end_date', 'total_price', 'status', 'payment_method', 'created_at');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('start')) {
            $query->where('start_date', '>=', $request->start);
        }
        if ($request->has('end')) {
            $query->where('end_date', '<=', $request->end);
        }

        $reservations = $query->latest('id')->get();
        $filename     = 'VRC-reservations-' . now()->format('Y-m-d') . '.csv';

        return new StreamedResponse(function () use ($reservations) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM for Excel

            fputcsv($handle, ['ID', 'Client', 'Email', 'Téléphone', 'Véhicule', 'Plaque', 'Début', 'Fin', 'Jours', 'Total (MAD)', 'Statut', 'Mode Paiement', 'Créé le'], ';');

            foreach ($reservations as $res) {
                $days = $res->start_date && $res->end_date
                    ? max(1, \Carbon\Carbon::parse($res->start_date)->diffInDays(\Carbon\Carbon::parse($res->end_date)))
                    : 0;

                fputcsv($handle, [
                    'VRC-' . str_pad($res->id, 5, '0', STR_PAD_LEFT),
                    $res->client?->name ?? '—',
                    $res->client?->email ?? '—',
                    $res->client?->phone ?? '—',
                    $res->vehicle ? "{$res->vehicle->brand} {$res->vehicle->model}" : '—',
                    $res->vehicle?->plate ?? '—',
                    $res->start_date ? \Carbon\Carbon::parse($res->start_date)->format('d/m/Y') : '—',
                    $res->end_date   ? \Carbon\Carbon::parse($res->end_date)->format('d/m/Y') : '—',
                    $days,
                    number_format($res->total_price, 2, ',', ' '),
                    $res->status,
                    $res->payment_method ?? '—',
                    \Carbon\Carbon::parse($res->created_at)->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($handle);
        }, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    // ─── Export P&L mensuel (revenus - coûts = profit net) ───────────────────
    /**
     * Génère un CSV du Profit & Loss mensuel par véhicule.
     * Colonnes : Véhicule | Plaque | Mois | Revenus (MAD) | Dépenses (MAD) | Maintenance (MAD) | Profit Net (MAD)
     */
    public function profitLoss(Request $request)
    {
        $year     = (int) $request->query('year', now()->year);
        $filename = "VRC-PL-{$year}.csv";

        // Revenus mensuels par véhicule (depuis payments)
        $revenues = DB::table('payments')
            ->join('reservations', 'payments.reservation_id', '=', 'reservations.id')
            ->join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->selectRaw('
                vehicles.id as vehicle_id,
                vehicles.brand,
                vehicles.model,
                vehicles.plate,
                MONTH(payments.created_at) as month,
                SUM(payments.paid_amount) as revenue
            ')
            ->whereYear('payments.created_at', $year)
            ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model', 'vehicles.plate', DB::raw('MONTH(payments.created_at)'))
            ->get()
            ->groupBy('vehicle_id');

        // Dépenses mensuelles par véhicule
        $expenses = DB::table('expenses')
            ->whereYear('expense_date', $year)
            ->whereNotNull('vehicle_id')
            ->selectRaw('vehicle_id, MONTH(expense_date) as month, SUM(amount) as total')
            ->groupBy('vehicle_id', DB::raw('MONTH(expense_date)'))
            ->get()
            ->groupBy('vehicle_id');

        // Coûts de maintenance mensuels par véhicule
        $maintenances = DB::table('maintenances')
            ->whereYear('created_at', $year)
            ->selectRaw('vehicle_id, MONTH(created_at) as month, SUM(cost) as total')
            ->groupBy('vehicle_id', DB::raw('MONTH(created_at)'))
            ->get()
            ->groupBy('vehicle_id');

        $months = [
            1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
            5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
            9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre',
        ];

        return new StreamedResponse(function () use ($revenues, $expenses, $maintenances, $months, $year) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM

            fputcsv($handle, [
                'Véhicule', 'Plaque', 'Mois', 'Revenus (MAD)', 'Dépenses (MAD)',
                'Maintenance (MAD)', 'Coûts Totaux (MAD)', 'Profit Net (MAD)',
            ], ';');

            foreach ($revenues as $vehicleId => $vehicleRevenues) {
                foreach ($vehicleRevenues as $row) {
                    $month       = (int) $row->month;
                    $revenue     = (float) $row->revenue;
                    $expenseCost = (float) ($expenses[$vehicleId]?->firstWhere('month', $month)?->total ?? 0);
                    $maintCost   = (float) ($maintenances[$vehicleId]?->firstWhere('month', $month)?->total ?? 0);
                    $totalCosts  = $expenseCost + $maintCost;
                    $profit      = $revenue - $totalCosts;

                    fputcsv($handle, [
                        "{$row->brand} {$row->model}",
                        $row->plate,
                        $months[$month] . " {$year}",
                        number_format($revenue, 2, ',', ' '),
                        number_format($expenseCost, 2, ',', ' '),
                        number_format($maintCost, 2, ',', ' '),
                        number_format($totalCosts, 2, ',', ' '),
                        number_format($profit, 2, ',', ' '),
                    ], ';');
                }
            }

            fclose($handle);
        }, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
