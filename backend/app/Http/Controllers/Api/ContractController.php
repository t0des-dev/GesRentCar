<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateContractPdf;
use App\Models\Contract;
use App\Models\Reservation;
use App\Models\Setting;
use App\Services\ArPdfService;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    /**
     * Resolve any image URL/path to a local temp file path suitable for DomPDF.
     * DomPDF cannot fetch external URLs or use data URIs reliably.
     */
    protected function resolveImage(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        // Already a data URI — decode to temp file
        if (str_starts_with($url, 'data:')) {
            if (preg_match('#^data:[^;]+;base64,(.+)$#', $url, $m)) {
                $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                file_put_contents($tmp, base64_decode($m[1]));

                return $tmp;
            }

            return null;
        }

        // Resolve /api/documents/preview/{filename} → private/documents/clients/{filename}
        if (preg_match('#/api/documents/preview/(.+)$#', $url, $m)) {
            $path = 'private/documents/clients/'.$m[1];
            if (Storage::exists($path)) {
                $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                file_put_contents($tmp, Storage::get($path));

                return $tmp;
            }

            return null;
        }

        // Resolve /api/storage/{path} → strip prefix, read from public disk
        if (preg_match('#^/api/storage/(.+)$#', $url, $m)) {
            $diskPath = $m[1];
            $disk = Storage::disk('public');
            if ($disk->exists($diskPath)) {
                $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                file_put_contents($tmp, $disk->get($diskPath));

                return $tmp;
            }

            return null;
        }

        // Resolve /storage/{path} → strip prefix, read from public disk
        if (preg_match('#^/storage/(.+)$#', $url, $m)) {
            $diskPath = $m[1];
            $disk = Storage::disk('public');
            if ($disk->exists($diskPath)) {
                $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                file_put_contents($tmp, $disk->get($diskPath));

                return $tmp;
            }

            return null;
        }

        // Absolute URL — download to temp file
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            try {
                $response = Http::timeout(10)->get($url);
                if ($response->successful()) {
                    $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                    file_put_contents($tmp, $response->body());

                    return $tmp;
                }
            } catch (\Exception $e) {
                return null;
            }
        }

        // Storage path on public disk (no prefix)
        $disk = Storage::disk('public');
        if ($disk->exists($url)) {
            $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
            file_put_contents($tmp, $disk->get($url));

            return $tmp;
        }

        return null;
    }

    protected function prepareImageData(array $data): array
    {
        $data['cinImageUrl'] = $this->resolveImage($data['client']->cin_image_url ?? null);
        $data['licenseImageUrl'] = $this->resolveImage($data['client']->license_image_url ?? null);

        // Agency logo
        if (! empty($data['agencyLogo'])) {
            $data['agencyLogo'] = $this->resolveImage($data['agencyLogo']);
        }

        // Vehicle photos (main + up to 3 from photos array)
        $vehiclePhotos = [];
        $mainPhoto = $data['vehicle']->image_url ?? null;
        if ($mainPhoto) {
            $vehiclePhotos[] = $this->resolveImage($mainPhoto);
        }
        $extraPhotos = $data['vehicle']->photos ?? [];
        foreach (array_slice($extraPhotos, 0, 3) as $photo) {
            $vehiclePhotos[] = $this->resolveImage($photo);
        }
        $data['vehiclePhotos'] = $vehiclePhotos;

        // Signature
        $sigData = $data['reservation']->contract->signature_data ?? null;
        if ($sigData && ! str_starts_with($sigData, 'data:') && ! str_starts_with($sigData, '/')) {
            $data['reservation']->contract->signature_data = $this->resolveImage($sigData);
        }

        return $data;
    }
    protected $notificationService;
    protected ArPdfService $arPdf;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
        $this->arPdf = new ArPdfService();
    }

    protected function getAgencyData(): array
    {
        $nameRow = Setting::where('key', 'agency_name')->first();
        $addressRow = Setting::where('key', 'agency_address')->first();
        $phoneRow = Setting::where('key', 'agency_phone')->first();
        $emailRow = Setting::where('key', 'agency_email')->first();
        $logoRow = Setting::where('key', 'agency_logo_url')->first();

        return [
            'agencyName' => $nameRow?->value ?? 'Vectoria Rent Car',
            'agencyAddress' => $addressRow?->value ?? 'Casablanca, Maroc',
            'agencyPhone' => $phoneRow?->value ?? '+212 5 22 XX XX XX',
            'agencyEmail' => $emailRow?->value ?? 'contact@vectoria.ma',
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

        $viewData = array_merge([
            'reservation' => $reservation,
            'client' => $reservation->client,
            'vehicle' => $reservation->vehicle,
            'lang' => $lang,
            'agentName' => $agentName,
        ], $agencyData);
        $viewData = $this->prepareImageData($viewData);

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
        // In a real prod scenario, we would check a secure hash/token.
        // For MVP, we allow signing if it hasn't been signed yet.
        if ($reservation->contract && $reservation->contract->signed_at) {
            return response()->json(['message' => 'Contrat déjà signé.'], 403);
        }

        return $this->sign($request, $reservation);
    }
}
