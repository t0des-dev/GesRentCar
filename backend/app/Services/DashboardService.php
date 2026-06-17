<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Vehicle;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Calculates Monthly Revenue based on confirmed payments.
     */
    public function getMonthlyRevenue(int $year, int $month): float
    {
        return Payment::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->whereIn('type', ['payment', 'deposit']) // Exclude refund logic by adding it below
            ->sum('paid_amount');
    }

    /**
     * Calculates Vehicle Rotation Rate (Taux de rotation) for the current month.
     * Formula: (Total Days Rented / (Total Fleet Size * Days in Month)) * 100
     */
    public function getRotationRate(): float
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $daysInMonth = $startOfMonth->diffInDays($endOfMonth) + 1;

        $totalVehicles = Vehicle::count();
        if ($totalVehicles === 0) {
            return 0.0;
        }

        $activeReservations = Reservation::whereIn('status', ['confirmed', 'active', 'completed'])
            ->where(function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereBetween('start_date', [$startOfMonth, $endOfMonth])
                    ->orWhereBetween('end_date', [$startOfMonth, $endOfMonth])
                    ->orWhere(function ($q) use ($startOfMonth, $endOfMonth) {
                        $q->where('start_date', '<', $startOfMonth)
                            ->where('end_date', '>', $endOfMonth);
                    });
            })->get();

        $totalRentedDays = 0;

        foreach ($activeReservations as $res) {
            $effectiveStart = $res->start_date->max($startOfMonth);
            $effectiveEnd = $res->end_date->min($endOfMonth);
            $days = $effectiveStart->diffInDays($effectiveEnd) + 1;
            $totalRentedDays += $days;
        }

        $maxPossibleDays = $totalVehicles * $daysInMonth;

        return round(($totalRentedDays / $maxPossibleDays) * 100, 2);
    }

    /**
     * Generates CSV format string for Reservations.
     */
    public function exportReservationsCSV(): string
    {
        $reservations = Reservation::with(['client', 'vehicle'])->get();
        $csv = "ID,Client,Vehicle,Start Date,End Date,Status,Total Price\n";

        foreach ($reservations as $res) {
            $clientName = $res->client ? $res->client->name : 'N/A';
            $vehiclePlate = $res->vehicle ? $res->vehicle->plate : 'N/A';
            $startDate = $res->start_date ? $res->start_date->format('Y-m-d') : 'N/A';
            $endDate = $res->end_date ? $res->end_date->format('Y-m-d') : 'N/A';

            $csv .= "{$res->id},\"{$clientName}\",\"{$vehiclePlate}\",{$startDate},{$endDate},{$res->status},{$res->total_price}\n";
        }

        return $csv;
    }
}
