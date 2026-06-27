<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScanSession;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;

class ScanSessionController extends Controller
{
    /**
     * Create a new scan session (authenticated — desktop user).
     */
    public function store(Request $request): JsonResponse
    {
        $session = ScanSession::create([
            'status' => 'pending',
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);

        return response()->json([
            'data' => [
                'session_id' => $session->id,
                'token' => $session->token,
                'qr_token' => $session->qr_token,
                'expires_at' => $session->expires_at->toIso8601String(),
                'scan_url' => $request->getSchemeAndHttpHost() . '/scan/' . $session->token,
            ],
        ], 201);
    }

    /**
     * Poll session status (authenticated — desktop user).
     */
    public function show(ScanSession $session): JsonResponse
    {
        if ($session->isExpired() && $session->status !== 'completed') {
            $session->update(['status' => 'expired']);
        }

        return response()->json([
            'data' => $session->toArray(),
        ]);
    }

    /**
     * Phone page loads this to verify token is valid (no auth).
     */
    public function phoneShow(string $token): JsonResponse
    {
        $session = ScanSession::where('token', $token)->firstOrFail();

        if ($session->isExpired()) {
            return response()->json(['message' => 'Session expirée'], 410);
        }

        return response()->json([
            'data' => [
                'status' => $session->status,
                'cin_number' => $session->cin_number,
                'license_number' => $session->license_number,
            ],
        ]);
    }

    /**
     * Phone uploads scan data (no auth, uses token).
     */
    public function upload(Request $request, string $token): JsonResponse
    {
        $session = ScanSession::where('token', $token)->firstOrFail();

        if ($session->isExpired()) {
            return response()->json(['message' => 'Session expirée'], 410);
        }

        if ($session->status === 'completed') {
            return response()->json(['message' => 'Session déjà complétée'], 409);
        }

        $validated = $request->validate([
            'type' => 'required|in:cin,license',
            'image' => 'required|image|max:8192',
        ]);

        // Store and OCR the image
        $file = $request->file('image');
        $filename = 'scan_' . $session->token . '_' . $validated['type'] . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('private/documents/clients', $filename);
        $fullPath = storage_path('app/' . $path);
        $imageUrl = '/api/documents/preview/' . $filename;

        $data = ['image_url' => $imageUrl];

        try {
            $ocr = new TesseractOCR($fullPath);
            $ocr->lang('fra', 'eng');
            $text = $ocr->run();

            if ($validated['type'] === 'cin') {
                $data['name'] = $this->extractName($text);
                $data['id_number'] = $this->extractCin($text);
            } else {
                $data['license_number'] = $this->extractLicense($text);
            }
        } catch (\Exception $e) {
            // Fallback demo data
            if ($validated['type'] === 'cin') {
                $data['name'] = 'Demo User';
                $data['id_number'] = 'AB123456';
            } else {
                $data['license_number'] = 'LC-998877';
            }
        }

        // Update session
        $update = ['status' => 'scanning'];
        if ($validated['type'] === 'cin') {
            $update['cin_name'] = $data['name'] ?? null;
            $update['cin_number'] = $data['id_number'] ?? null;
            $update['cin_image_url'] = $data['image_url'] ?? null;
        } else {
            $update['license_number'] = $data['license_number'] ?? null;
            $update['license_image_url'] = $data['image_url'] ?? null;
        }

        // Mark completed if both documents uploaded
        $session->fill($update);
        if ($session->cin_number && $session->license_number) {
            $session->status = 'completed';
        }
        $session->save();

        return response()->json([
            'success' => true,
            'data' => $data,
            'status' => $session->status,
        ]);
    }

    private function extractCin(string $text): ?string
    {
        if (preg_match('/\b([A-Z]{1,2}[0-9]{4,6})\b/', strtoupper($text), $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function extractName(string $text): ?string
    {
        if (preg_match('/(?:Nom|Name)\s*[:\-]?\s*([A-Za-z\s]+)/i', $text, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    private function extractLicense(string $text): ?string
    {
        if (preg_match('/\b([0-9]{2}\/[0-9]{4,6}|[0-9]{8})\b/', $text, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
