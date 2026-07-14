<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ContractService
{
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
