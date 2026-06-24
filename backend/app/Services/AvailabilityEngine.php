<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Vehicle;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class AvailabilityEngine
{
    /**
     * Secures a vehicle for booking using pessimistic locking to prevent race conditions.
     *
     * @param  string|Carbon  $startDate
     * @param  string|Carbon  $endDate
     *
     * @throws Exception
     */
    public function secureBooking(int $vehicleId, $startDate, $endDate, array $reservationData): Reservation
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($start->greaterThanOrEqualTo($end)) {
            throw new Exception('Invalid date range: Start date must be before end date.');
        }

        return DB::transaction(function () use ($vehicleId, $start, $end, $reservationData) {
            // Pessimistic lock: SELECT FOR UPDATE
            // This prevents other concurrent requests from booking this vehicle
            $vehicle = Vehicle::where('id', $vehicleId)->lockForUpdate()->first();

            if (! $vehicle) {
                throw new Exception('Vehicle not found.');
            }

            if ($vehicle->status === 'maintenance') {
                throw new Exception('Vehicle is currently under maintenance.');
            }

            // Check for overlaps with active or pending reservations
            $hasOverlap = Reservation::where('vehicle_id', $vehicleId)
                ->whereIn('status', ['pending_payment', 'pending_partner', 'confirmed', 'ongoing'])
                ->where(function ($query) use ($start, $end) {
                    $query->whereBetween('start_date', [$start, $end])
                        ->orWhereBetween('end_date', [$start, $end])
                        ->orWhere(function ($q) use ($start, $end) {
                            $q->where('start_date', '<=', $start)
                                ->where('end_date', '>=', $end);
                        });
                })->exists();

            if ($hasOverlap) {
                throw new Exception('Double booking detected. Vehicle is no longer available for these dates.');
            }

            // Calculate total price based on vehicle's daily rate
            $days = $start->diffInDays($end) ?: 1;
            $totalPrice = $vehicle->price_per_day * $days;

            // Safe to create reservation
            $reservation = Reservation::create(array_merge($reservationData, [
                'vehicle_id' => $vehicleId,
                'start_date' => $start,
                'end_date' => $end,
                'total_price' => $totalPrice,
                'deposit_amount' => $vehicle->type === 'internal' ? ($totalPrice * 0.10) : 0, // 10% for internal
                'status' => $vehicle->type === 'collaborator' ? 'pending_partner' : 'pending_payment',
            ]));

            return $reservation;
        });
    }

    /**
     * Utility method to quickly check availability without locking.
     * Useful for search listings.
     */
    public function isAvailable(int $vehicleId, $startDate, $endDate): bool
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        return ! Reservation::where('vehicle_id', $vehicleId)
            ->whereIn('status', ['pending_payment', 'pending_partner', 'confirmed', 'ongoing'])
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_date', [$start, $end])
                    ->orWhereBetween('end_date', [$start, $end])
                    ->orWhere(function ($q) use ($start, $end) {
                        $q->where('start_date', '<=', $start)
                            ->where('end_date', '>=', $end);
                    });
            })->exists();
    }
}
