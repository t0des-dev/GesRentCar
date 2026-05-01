<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Reservation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    public function generateContract(Reservation $reservation): Contract
    {
        $client = $reservation->client;
        $vehicle = $reservation->vehicle;

        $pdf = Pdf::loadView('pdf.contract', [
            'reservation' => $reservation,
            'client' => $client,
            'vehicle' => $vehicle,
        ]);

        $fileName = 'contracts/contract_' . $reservation->id . '_' . time() . '.pdf';
        
        Storage::disk('public')->put($fileName, $pdf->output());

        $contract = Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $fileName]
        );

        return $contract;
    }

    public function signContract(Contract $contract, string $signatureBase64): Contract
    {
        $contract->update([
            'signature_data' => $signatureBase64,
            'signed_at' => now(),
        ]);

        // Re-generate PDF with signature embedded
        $this->generateContract($contract->reservation);

        // Dispatch notifications
        $this->sendNotifications($contract);

        return $contract;
    }

    protected function sendNotifications(Contract $contract)
    {
        $client = $contract->reservation->client;
        
        // Mock WhatsApp sending via a queued job or API call
        Log::info("WhatsApp notification sent to {$client->phone} with contract ID {$contract->id}");
        
        // Mock Email sending
        if ($client->email) {
            Log::info("Email notification sent to {$client->email} with contract attached.");
        }
    }
}
