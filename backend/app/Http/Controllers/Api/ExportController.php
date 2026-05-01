<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function reservations()
    {
        $reservations = Reservation::with(['client', 'vehicle'])->get();

        $response = new StreamedResponse(function () use ($reservations) {
            $handle = fopen('php://output', 'w');
            
            // CSV Header
            fputcsv($handle, ['ID', 'Client', 'Vehicle', 'Start Date', 'End Date', 'Total Price', 'Status']);

            foreach ($reservations as $res) {
                fputcsv($handle, [
                    $res->id,
                    $res->client->name,
                    $res->vehicle->brand . ' ' . $res->vehicle->model,
                    $res->start_date,
                    $res->end_date,
                    $res->total_price,
                    $res->status
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="reservations_export_' . now()->format('Y-m-d') . '.csv"',
        ]);

        return $response;
    }
}
