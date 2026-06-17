<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Reservation;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $invoices = Invoice::with('reservation.client', 'reservation.vehicle')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($invoices);
    }

    public function store(Request $request, InvoiceService $invoiceService): JsonResponse
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);

        if ($reservation->status === 'cancelled') {
            return response()->json(['message' => 'Impossible de générer une facture pour une réservation annulée.'], 422);
        }

        $invoice = $invoiceService->generateInvoice($reservation);

        return response()->json($invoice, 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        return response()->json($invoice->load('reservation.client', 'reservation.vehicle'));
    }

    public function download(Invoice $invoice, InvoiceService $invoiceService): Response
    {
        $path = $invoiceService->generatePdf($invoice);
        $filename = "{$invoice->invoice_number}.pdf";

        return Storage::disk('local')->download($path, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function markAsPaid(Invoice $invoice, InvoiceService $invoiceService): JsonResponse
    {
        if ($invoice->status === 'paid') {
            return response()->json(['message' => 'Cette facture est déjà payée.']);
        }

        $invoice = $invoiceService->markAsPaid($invoice);

        return response()->json([
            'message' => 'Facture marquée comme payée.',
            'invoice' => $invoice,
        ]);
    }
}
