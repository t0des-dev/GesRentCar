<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Reservation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    private const VAT_RATE = 20.0;

    public function generateInvoice(Reservation $reservation): Invoice
    {
        $existing = Invoice::where('reservation_id', $reservation->id)->first();
        if ($existing) {
            return $existing;
        }

        $reservation->load(['client', 'vehicle', 'payment']);

        $totalTTC = $reservation->total_price;
        $subtotalHT = $totalTTC / (1 + (self::VAT_RATE / 100));
        $vatAmount = $totalTTC - $subtotalHT;

        $paidAmount = $reservation->payment?->paid_amount ?? 0;
        $remaining = max(0, $totalTTC - $paidAmount);

        $invoice = Invoice::create([
            'reservation_id' => $reservation->id,
            'invoice_number' => Invoice::generateNumber(),
            'subtotal_ht' => round($subtotalHT, 2),
            'vat_rate' => self::VAT_RATE,
            'vat_amount' => round($vatAmount, 2),
            'total_ttc' => round($totalTTC, 2),
            'deposit_amount' => round($reservation->deposit_amount, 2),
            'remaining_amount' => round($remaining, 2),
            'status' => $remaining <= 0 ? 'paid' : 'issued',
            'issued_at' => now(),
            'due_at' => now()->addDays(30),
            'paid_at' => $remaining <= 0 ? now() : null,
        ]);

        return $invoice;
    }

    public function generatePdf(Invoice $invoice): string
    {
        $invoice->load(['reservation.client', 'reservation.vehicle']);

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'reservation' => $invoice->reservation,
            'client' => $invoice->reservation->client,
            'vehicle' => $invoice->reservation->vehicle,
        ]);

        $filename = "{$invoice->invoice_number}.pdf";
        $path = "invoices/{$filename}";

        Storage::disk('local')->put($path, $pdf->output());

        return $path;
    }

    public function markAsPaid(Invoice $invoice): Invoice
    {
        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'remaining_amount' => 0,
        ]);

        return $invoice;
    }
}
