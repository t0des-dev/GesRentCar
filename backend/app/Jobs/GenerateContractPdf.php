<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\Reservation;
use App\Models\Setting;
use App\Services\ArPdfService;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class GenerateContractPdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    protected $reservationId;

    protected $lang;

    public function __construct(int $reservationId, string $lang = 'fr')
    {
        $this->reservationId = $reservationId;
        $this->lang = $lang;
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

    protected function resolveImage(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        if (str_starts_with($url, 'data:')) {
            if (preg_match('#^data:[^;]+;base64,(.+)$#', $url, $m)) {
                $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                file_put_contents($tmp, base64_decode($m[1]));

                return $tmp;
            }

            return null;
        }

        if (preg_match('#/api/documents/preview/(.+)$#', $url, $m)) {
            $path = 'private/documents/clients/'.$m[1];
            if (Storage::exists($path)) {
                $tmp = tempnam(sys_get_temp_dir(), 'contract_img_');
                file_put_contents($tmp, Storage::get($path));

                return $tmp;
            }

            return null;
        }

        // /api/storage/{path} → public disk
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

        // /storage/{path} → public disk
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

        $sigData = $data['reservation']->contract->signature_data ?? null;
        if ($sigData && ! str_starts_with($sigData, 'data:') && ! str_starts_with($sigData, '/')) {
            $data['reservation']->contract->signature_data = $this->resolveImage($sigData);
        }

        return $data;
    }

    public function handle(NotificationService $notificationService): void
    {
        $reservation = Reservation::with(['client', 'vehicle', 'vehicle.agent', 'contract'])->findOrFail($this->reservationId);

        App::setLocale($this->lang);

        $agentName = $reservation->vehicle && $reservation->vehicle->agent
            ? $reservation->vehicle->agent->name
            : null;

        $agencyData = $this->getAgencyData();

        $viewData = array_merge([
            'reservation' => $reservation,
            'client' => $reservation->client,
            'vehicle' => $reservation->vehicle,
            'lang' => $this->lang,
            'agentName' => $agentName,
        ], $agencyData);
        $viewData = $this->prepareImageData($viewData);

        $tmpFiles = array_filter(array_merge([
            $viewData['cinImageUrl'] ?? null,
            $viewData['licenseImageUrl'] ?? null,
            $viewData['agencyLogo'] ?? null,
        ], $viewData['vehiclePhotos'] ?? []), fn ($f) => $f && str_starts_with($f, sys_get_temp_dir()));

        // Render the view to HTML then shape Arabic text for correct DomPDF rendering
        $arPdf = new ArPdfService();
        $html = view('pdf.contract', $viewData)->render();
        $html = $arPdf->shapeHtml($html);

        $pdf = Pdf::loadHtml($html)
            ->setPaper('a4', 'portrait')
            ->setOption('dpi', 150)
            ->setOption('defaultFont', 'DejaVu Sans');

        $fileName = 'contracts/contract_'.$reservation->id.'.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $fileName]
        );

        foreach ($tmpFiles as $tmp) {
            @unlink($tmp);
        }

        // Notify client that contract is ready for signing (or just notify that it's ready)
        $notificationService->sendContractLink($reservation);
    }
}
