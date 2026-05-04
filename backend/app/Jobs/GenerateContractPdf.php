<?php

namespace App\Jobs;

use App\Models\Reservation;
use App\Models\Contract;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\App;

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

    public function handle(NotificationService $notificationService): void
    {
        $reservation = Reservation::with(['client', 'vehicle'])->findOrFail($this->reservationId);
        
        App::setLocale($this->lang);

        $pdf = Pdf::loadView('pdf.contract', [
            'reservation' => $reservation,
            'client'      => $reservation->client,
            'vehicle'     => $reservation->vehicle,
            'lang'        => $this->lang,
        ])
        ->setPaper('a4', 'portrait')
        ->setOption('dpi', 150)
        ->setOption('defaultFont', 'DejaVu Sans');

        $fileName = 'contracts/contract_' . $reservation->id . '.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $fileName]
        );

        // Notify client that contract is ready for signing (or just notify that it's ready)
        $notificationService->sendContractLink($reservation);
    }
}
