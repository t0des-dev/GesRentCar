<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Contract;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

use App\Services\NotificationService;

class ContractController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    // ─── Generate and store PDF ────────────────────────────────────────────────
    public function generate(Reservation $reservation)
    {
        $lang = request('lang', 'fr');
        \Illuminate\Support\Facades\App::setLocale($lang);

        $pdf = Pdf::loadView('pdf.contract', [
            'reservation' => $reservation->load(['client', 'vehicle', 'contract']),
            'client'      => $reservation->client,
            'vehicle'     => $reservation->vehicle,
            'lang'        => $lang,
        ])
        ->setPaper('a4', 'portrait')
        ->setOption('dpi', 150)
        ->setOption('defaultFont', 'DejaVu Sans')
        ->setOption('isRemoteEnabled', false);

        $fileName = 'contracts/contract_' . $reservation->id . '.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        $contract = Contract::updateOrCreate(
            ['reservation_id' => $reservation->id],
            ['file_path' => $fileName]
        );

        $this->notificationService->sendContractLink($reservation);

        return response()->json([
            'message'  => 'Contract generated successfully.',
            'contract' => $contract,
            'url'      => asset('storage/' . $fileName),
        ]);
    }

    // ─── Public stream: download PDF directly (used by frontend after payment) ─
    public function download(Reservation $reservation)
    {
        $lang = request('lang', 'fr');

        $pdf = Pdf::loadView('pdf.contract', [
            'reservation' => $reservation->load(['client', 'vehicle', 'contract']),
            'client'      => $reservation->client,
            'vehicle'     => $reservation->vehicle,
            'lang'        => $lang,
        ])
        ->setPaper('a4', 'portrait')
        ->setOption('dpi', 150)
        ->setOption('defaultFont', 'DejaVu Sans');

        $filename = 'VRC-Contrat-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT) . '.pdf';

        return $pdf->download($filename);
    }

    // ─── Sign the contract and re-generate ────────────────────────────────────
    public function sign(Request $request, Reservation $reservation)
    {
        $request->validate([
            'signature' => 'required|string'
        ]);

        $contract = $reservation->contract;

        if (!$contract) {
            // Auto-generate if not yet created
            $fileName = 'contracts/contract_' . $reservation->id . '.pdf';
            $contract = Contract::create([
                'reservation_id' => $reservation->id,
                'file_path'      => $fileName,
            ]);
        }

        $contract->update([
            'signature_data' => $request->signature,
            'signed_at'      => now(),
        ]);

        // Re-generate PDF with signature embedded
        $this->generate($reservation);

        $this->notificationService->notifyContractSigned($reservation);

        return response()->json([
            'message'  => 'Contract signed successfully.',
            'contract' => $contract->fresh(),
            'url'      => asset('storage/' . $contract->file_path),
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

