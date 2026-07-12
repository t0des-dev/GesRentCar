<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateContractPdf;
use App\Models\Contract;
use App\Models\Reservation;
use App\Models\Setting;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    protected function getAgencyData(): array
    {
        $nameRow = Setting::where('key', 'agency_name')->first();
        $sloganRow = Setting::where('key', 'agency_slogan')->first();
        $logoRow = Setting::where('key', 'agency_logo_url')->first();

        return [
            'agencyName' => $nameRow?->value ?? 'Vectoria Rent Car',
            'agencyAddress' => $sloganRow?->value ?? 'Casablanca, Maroc',
            'agencyPhone' => '+212 5 22 XX XX XX',
            'agencyEmail' => 'contact@vectoria.ma',
            'agencyLogo' => $logoRow?->value ?? null,
            'agencyRC' => '160455',
        ];
    }

    // ─── Generate and store PDF ────────────────────────────────────────────────
    public function generate(Reservation $reservation)
    {
        $lang = request('lang', 'fr');

        GenerateContractPdf::dispatch($reservation->id, $lang);

        return response()->json([
            'message' => 'Contract generation queued.',
            'reservation_id' => $reservation->id,
        ]);
    }

    // ─── Serve stored PDF file ────────────────────────────────────────────────
    public function file(Reservation $reservation)
    {
        $contract = $reservation->contract;

        if (! $contract || ! $contract->file_path) {
            abort(404, 'Contract not found.');
        }

        $path = $contract->file_path;

        if (! Storage::disk('public')->exists($path)) {
            abort(404, 'Contract file not found on disk.');
        }

        $filename = basename($path);

        return Storage::disk('public')->download($path, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    // ─── Public stream: serve cached PDF or generate on-the-fly ──────────────
    public function download(Reservation $reservation)
    {
        $reservation->load(['client', 'vehicle', 'contract']);

        $lang = request('lang', 'fr');
        \App::setLocale($lang);

        $padded = str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
        $filename = 'VRC-Contrat-'.$padded.'.pdf';

        // 1. Serve cached PDF from storage (skip if ?regenerate=1)
        $storedPath = 'contracts/contract_'.$reservation->id.'.pdf';
        if (Storage::disk('public')->exists($storedPath) && ! request()->boolean('regenerate')) {
            return Storage::disk('public')->download($storedPath, $filename, [
                'Content-Type' => 'application/pdf',
            ]);
        }

        // 2. Generate on-the-fly (first request only)
        $agencyData = $this->getAgencyData();
        $agentName = $reservation->vehicle && $reservation->vehicle->agent
            ? $reservation->vehicle->agent->name
            : null;

        $pdf = Pdf::loadView('pdf.contract', array_merge([
            'reservation' => $reservation,
            'client' => $reservation->client,
            'vehicle' => $reservation->vehicle,
            'lang' => $lang,
            'agentName' => $agentName,
        ], $agencyData))
            ->setPaper('a4', 'portrait')
            ->setOption('dpi', 150)
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setOption('defaultMediaType', 'print');

        // Cache for future requests
        Storage::disk('public')->put($storedPath, $pdf->output());

        Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $storedPath]
        );

        return $pdf->download($filename);
    }

    // ─── Sign the contract and re-generate ────────────────────────────────────
    public function sign(Request $request, Reservation $reservation)
    {
        $request->validate([
            'signature' => 'required|string',
        ]);

        $contract = $reservation->contract;

        if (! $contract) {
            // Auto-generate if not yet created
            $fileName = 'contracts/contract_'.$reservation->id.'.pdf';
            $contract = Contract::create([
                'reservation_id' => $reservation->id,
                'file_path' => $fileName,
            ]);
        }

        $contract->update([
            'signature_data' => $request->signature,
            'signed_at' => now(),
        ]);

        // Re-generate PDF with signature embedded in background
        GenerateContractPdf::dispatch($reservation->id, 'fr');
        $this->notificationService->notifyContractSigned($reservation);

        return response()->json([
            'message' => 'Signature received. Contract re-generation queued.',
            'contract' => $contract->fresh(),
        ]);
    }

    // ─── Public signing wrapper ────────────────────────────────────────────────
    public function publicSign(Request $request, Reservation $reservation)
    {
        // In a real prod scenario, we would check a secure hash/token.
        // For MVP, we allow signing if it hasn't been signed yet.
        if ($reservation->contract && $reservation->contract->signed_at) {
            return response()->json(['message' => 'Contrat déjà signé.'], 403);
        }

        return $this->sign($request, $reservation);
    }
}
