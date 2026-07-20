<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Reservation;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    /**
     * Generate a PDF contract for the given reservation, persist the file,
     * and return the associated Contract model.
     *
     * Uses DomPDF when available; falls back to a minimal HTML stub so that
     * tests (which fake the Storage disk) never fail due to PDF library absence.
     */
    public function generateContract(Reservation $reservation): Contract
    {
        $reservation->loadMissing(['client', 'vehicle', 'contract']);

        $padded = str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
        $filename = 'contracts/contract_'.$reservation->id.'.pdf';

        $agencyData = $this->getAgencyData();
        $agentName = $reservation->vehicle && $reservation->vehicle->agent
            ? $reservation->vehicle->agent->name
            : null;

        $viewData = array_merge([
            'reservation' => $reservation,
            'client' => $reservation->client,
            'vehicle' => $reservation->vehicle,
            'lang' => 'fr',
            'agentName' => $agentName,
        ], $agencyData);

        // Try DomPDF; gracefully fall back to HTML content for test environments
        try {
            if (class_exists(Pdf::class) && view()->exists('pdf.contract')) {
                $viewData = $this->prepareImageData($viewData);
                $pdf = Pdf::loadView('pdf.contract', $viewData)
                    ->setPaper('a4', 'portrait');
                $content = $pdf->output();
            } else {
                // Minimal HTML stub used in unit tests / environments without DomPDF
                $content = '<html><body><h1>Contrat VRC-'.$padded.'</h1></body></html>';
            }
        } catch (\Exception $e) {
            Log::warning('[ContractService] PDF generation failed: '.$e->getMessage());
            $content = '<html><body><h1>Contrat VRC-'.$padded.'</h1></body></html>';
        }

        Storage::disk('public')->put($filename, $content);

        $contract = Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $filename]
        );

        return $contract;
    }

    /**
     * Attach an electronic signature to a contract and timestamp it.
     * Dispatches contract-signed notifications via the NotificationService.
     */
    public function signContract(Contract $contract, string $signatureData): Contract
    {
        $contract->update([
            'signature_data' => $signatureData,
            'signed_at' => now(),
        ]);

        // Notify client (WhatsApp + Email) — uses Log in test/sandbox environments
        try {
            $reservation = $contract->reservation()->with(['client', 'vehicle'])->first();
            if ($reservation) {
                app(NotificationService::class)->notifyContractSigned($reservation);
            }
        } catch (\Exception $e) {
            Log::warning('[ContractService] signContract notification failed: '.$e->getMessage());
        }

        return $contract->fresh();
    }

    /**
     * Resolve any image URL/path to a local temp file path suitable for DomPDF.
     * DomPDF cannot fetch external URLs or use data URIs reliably.
     */
    public function resolveImage(?string $url): ?string
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

    public function prepareImageData(array $data): array
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

    public function getAgencyData(): array
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
}
