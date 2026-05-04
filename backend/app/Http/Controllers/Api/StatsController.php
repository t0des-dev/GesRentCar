<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function revenueByCategory()
    {
        $stats = DB::table('payments')
            ->join('reservations', 'payments.reservation_id', '=', 'reservations.id')
            ->join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->select('vehicles.category', DB::raw('SUM(payments.paid_amount) as total_revenue'), DB::raw('COUNT(DISTINCT reservations.id) as reservation_count'))
            ->groupBy('vehicles.category')
            ->get();

        return response()->json($stats);
    }

    public function calendarData()
    {
        $reservations = DB::table('reservations')
            ->join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->join('clients', 'reservations.client_id', '=', 'clients.id')
            ->select(
                'reservations.id',
                'reservations.start_date',
                'reservations.end_date',
                'reservations.status',
                'reservations.client_id',
                'clients.name as client_name',
                'vehicles.id as vehicle_id',
                'vehicles.brand',
                'vehicles.model',
                'vehicles.plate'
            )
            ->whereIn('reservations.status', ['confirmed', 'active', 'pending'])
            ->get();

        return response()->json($reservations);
    }

    public function generalStats()
    {
        $totalRevenue = (float) Payment::sum('paid_amount');
        $reservationsCount = DB::table('reservations')->count();
        $activeBookings = DB::table('reservations')->whereIn('status', ['confirmed', 'active'])->count();
        $fleetSize = DB::table('vehicles')->count();
        
        $occupancyRate = $fleetSize > 0 ? round(($activeBookings / $fleetSize) * 100) : 0;

        // Revenue History (Last 6 months) - pgsql compatible
        $revenueHistory = DB::table('payments')
            ->select(DB::raw("TO_CHAR(created_at, 'MM') as month"), DB::raw('SUM(paid_amount) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                $months = [
                    '01' => 'Jan', '02' => 'Feb', '03' => 'Mar', '04' => 'Apr',
                    '05' => 'May', '06' => 'Jun', '07' => 'Jul', '08' => 'Aug',
                    '09' => 'Sep', '10' => 'Oct', '11' => 'Nov', '12' => 'Dec'
                ];
                return [
                    'month' => $months[$item->month] ?? $item->month,
                    'revenue' => (float) $item->revenue
                ];
            });

        // Fleet Distribution (by category)
        $fleetDistribution = DB::table('vehicles')
            ->select('category as name', DB::raw('COUNT(*) as value'))
            ->groupBy('category')
            ->get();

        // Document Expiration & Maintenance Alerts
        $thirtyDaysFromNow = now()->addDays(30)->toDateString();
        $today = now()->toDateString();
        
        $expiringVehicles = DB::table('vehicles')
            ->where(function($q) use ($thirtyDaysFromNow, $today) {
                $q->whereBetween('insurance_date', [$today, $thirtyDaysFromNow])
                  ->orWhere('insurance_date', '<', $today)
                  ->orWhereBetween('tech_inspection_date', [$today, $thirtyDaysFromNow])
                  ->orWhere('tech_inspection_date', '<', $today)
                  ->orWhereBetween('vignette_date', [$today, $thirtyDaysFromNow])
                  ->orWhere('vignette_date', '<', $today);
            })
            // Removed manual deleted_at check as column is missing in migration
            ->select('brand', 'model', 'plate', 'insurance_date', 'tech_inspection_date', 'vignette_date')
            ->limit(5)
            ->get()
            ->map(function($v) use ($today) {
                $days = 999;
                $reason = "Alerte";
                
                if ($v->insurance_date) {
                    $d = \Carbon\Carbon::parse($v->insurance_date)->diffInDays(now(), false) * -1;
                    if ($d <= 30 && $d < $days) { $days = $d; $reason = "Assurance"; }
                }
                if ($v->tech_inspection_date) {
                    $d = \Carbon\Carbon::parse($v->tech_inspection_date)->diffInDays(now(), false) * -1;
                    if ($d <= 30 && $d < $days) { $days = $d; $reason = "Visite Technique"; }
                }
                if ($v->vignette_date) {
                    $d = \Carbon\Carbon::parse($v->vignette_date)->diffInDays(now(), false) * -1;
                    if ($d <= 30 && $d < $days) { $days = $d; $reason = "Vignette"; }
                }

                return [
                    'vehicle' => $v->brand . ' ' . $v->model . ' (' . $reason . ')',
                    'plate' => $v->plate,
                    'days' => $days <= 0 ? 0 : floor($days)
                ];
            })
            ->sortBy('days')
            ->values();

        $maintenanceAlerts = $expiringVehicles;

        // Top Performing Vehicles
        $topVehicles = DB::table('reservations')
            ->join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->select('vehicles.brand', 'vehicles.model', DB::raw('COUNT(reservations.id) as count'), DB::raw('SUM(reservations.total_price) as revenue'))
            ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Payment Status Summary
        $paymentStatus = DB::table('payments')
            ->select('status as name', DB::raw('COUNT(*) as value'))
            ->groupBy('status')
            ->get();

        $clientsCount = DB::table('clients')->count();

        return response()->json([
            'revenue' => $totalRevenue,
            'reservations_count' => $reservationsCount,
            'active_bookings' => $activeBookings,
            'occupancy_rate' => $occupancyRate,
            'fleet_size' => $fleetSize,
            'clients_count' => $clientsCount,
            'maintenance_alerts' => $maintenanceAlerts,
            'revenue_history' => $revenueHistory,
            'fleet_distribution' => $fleetDistribution,
            'top_vehicles' => $topVehicles,
            'payment_status' => $paymentStatus,
        ]);
    }

    public function vehicleProfitability()
    {
        // Use subqueries to avoid join-inflation (Cartesian product)
        $revenueSub = DB::table('payments')
            ->join('reservations', 'payments.reservation_id', '=', 'reservations.id')
            ->select('reservations.vehicle_id', DB::raw('SUM(paid_amount) as total_revenue'))
            ->groupBy('reservations.vehicle_id');

        $costsSub = DB::table('maintenances')
            ->select('vehicle_id', DB::raw('SUM(cost) as total_costs'))
            ->groupBy('vehicle_id');

        $stats = DB::table('vehicles')
            ->leftJoinSub($revenueSub, 'rev', 'vehicles.id', '=', 'rev.vehicle_id')
            ->leftJoinSub($costsSub, 'costs', 'vehicles.id', '=', 'costs.vehicle_id')
            ->select(
                'vehicles.brand',
                'vehicles.model',
                'vehicles.plate',
                DB::raw('COALESCE(rev.total_revenue, 0) as total_revenue'),
                DB::raw('COALESCE(costs.total_costs, 0) as total_costs'),
                DB::raw('(COALESCE(rev.total_revenue, 0) - COALESCE(costs.total_costs, 0)) as net_profit')
            )
            ->whereNull('vehicles.deleted_at')
            ->orderByDesc('net_profit')
            ->get();

        return response()->json($stats);
    }
}
