<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateContractPdf;
use App\Models\Contract;
use App\Models\Reservation;
use App\Services\ArPdfService;
use App\Services\ContractService;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    protected $notificationService;

    protected ContractService $contractService;

    protected ArPdfService $arPdf;

    public function __construct(NotificationService $notificationService, ContractService $contractService)
    {
        $this->notificationService = $notificationService;
        $this->contractService = $contractService;
        $this->arPdf = new ArPdfService;
    }

    /**
     * Verify HMAC token: hash_hmac('sha256', $reservation->id, config('app.key'))
     */
    private function verifyToken(Reservation $reservation): bool
    {
        $token = request()->query('token');
        if (! $token) {
            return false;
        }
        $expected = hash_hmac('sha256', (string) $reservation->id, config('app.key'));

        return hash_equals($expected, $token);
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
        if (! $this->verifyToken($reservation)) {
            abort(403, 'Invalid or missing token.');
        }

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
        if (! $this->verifyToken($reservation)) {
            abort(403, 'Invalid or missing token.');
        }

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
        $agencyData = $this->contractService->getAgencyData();
        $agentName = $reservation->vehicle && $reservation->vehicle->agent
            ? $reservation->vehicle->agent->name
            : null;

        $viewData = array_merge([
            'reservation' => $reservation,
            'client' => $reservation->client,
            'vehicle' => $reservation->vehicle,
            'lang' => $lang,
            'agentName' => $agentName,
        ], $agencyData);
        $viewData = $this->contractService->prepareImageData($viewData);

        // Track temp files for cleanup
        $tmpFiles = array_filter(array_merge([
            $viewData['cinImageUrl'] ?? null,
            $viewData['licenseImageUrl'] ?? null,
            $viewData['agencyLogo'] ?? null,
        ], $viewData['vehiclePhotos'] ?? []), fn ($f) => $f && str_starts_with($f, sys_get_temp_dir()));

        // Render the view to HTML then shape Arabic text for correct DomPDF rendering
        $html = view('pdf.contract', $viewData)->render();
        $html = $this->arPdf->shapeHtml($html);

        $pdf = Pdf::loadHtml($html)
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

        // Cleanup temp image files
        foreach ($tmpFiles as $tmp) {
            @unlink($tmp);
        }

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
        if (! $this->verifyToken($reservation)) {
            abort(403, 'Invalid or missing token.');
        }

        if ($reservation->contract && $reservation->contract->signed_at) {
            return response()->json(['message' => 'Contrat déjà signé.'], 403);
        }

        return $this->sign($request, $reservation);
    }
}
