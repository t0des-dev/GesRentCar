<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\Reservation;
use App\Models\Setting;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;
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

    public function handle(NotificationService $notificationService): void
    {
        $reservation = Reservation::with(['client', 'vehicle', 'vehicle.agent', 'contract'])->findOrFail($this->reservationId);

        App::setLocale($this->lang);

        $agentName = $reservation->vehicle && $reservation->vehicle->agent
            ? $reservation->vehicle->agent->name
            : null;

        $agencyData = $this->getAgencyData();

        $pdf = Pdf::loadView('pdf.contract', array_merge([
            'reservation' => $reservation,
            'client' => $reservation->client,
            'vehicle' => $reservation->vehicle,
            'lang' => $this->lang,
            'agentName' => $agentName,
        ], $agencyData))
            ->setPaper('a4', 'portrait')
            ->setOption('dpi', 150)
            ->setOption('defaultFont', 'DejaVu Sans');

        $fileName = 'contracts/contract_'.$reservation->id.'.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $fileName]
        );

        // Notify client that contract is ready for signing (or just notify that it's ready)
        $notificationService->sendContractLink($reservation);
    }
}
