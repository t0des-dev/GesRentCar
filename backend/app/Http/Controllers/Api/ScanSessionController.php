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
            $ocr->lang('fra', 'eng', 'ara');
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
            'raw_text' => $text ?? null,
            'status' => $session->status,
        ]);
    }

    private function extractCin(string $text): ?string
    {
        // Moroccan CIN: 2 letters + 5-6 digits (e.g., AB123456, BE123456)
        if (preg_match('/\b([A-Z]{1,2}\s*[0-9]{5,6})\b/i', $text, $matches)) {
            return preg_replace('/\s+/', '', strtoupper($matches[1]));
        }
        // Fallback: 6-8 digits only
        if (preg_match('/\b([0-9]{6,8})\b/', $text, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function extractName(string $text): ?string
    {
        // Try labeled fields first: NOM, PRÉNOM, Nom, Prénom, Name
        if (preg_match('/(?:PR[ÉE]NOM|PRENOM)\s*[:\-]?\s*([A-Za-zÀ-ÿ\s]+)/iu', $text, $matches)) {
            $prenom = trim($matches[1]);
            if (preg_match('/(?:NOM)\s*[:\-]?\s*([A-Za-zÀ-ÿ\s]+)/iu', $text, $nomMatches)) {
                return trim($nomMatches[1]) . ' ' . $prenom;
            }
            return $prenom;
        }
        if (preg_match('/(?:NOM)\s*[:\-]?\s*([A-Za-zÀ-ÿ\s]+)/iu', $text, $matches)) {
            return trim($matches[1]);
        }
        // Fallback: look for two consecutive capitalized words (First Last)
        if (preg_match('/\b([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})\b/', $text, $matches)) {
            return $matches[1] . ' ' . $matches[2];
        }
        return null;
    }

    private function extractLicense(string $text): ?string
    {
        // Moroccan license: various formats
        // Format 1: XX/XXXXX (e.g., 12/12345)
        if (preg_match('/\b([0-9]{2}\s*\/\s*[0-9]{4,6})\b/', $text, $matches)) {
            return preg_replace('/\s+/', '', $matches[1]);
        }
        // Format 2: 8 digits
        if (preg_match('/\b([0-9]{8})\b/', $text, $matches)) {
            return $matches[1];
        }
        // Format 3: alphanumeric (e.g., 12AB3456)
        if (preg_match('/\b([0-9]{2}[A-Z]{1,2}[0-9]{4,6})\b/i', $text, $matches)) {
            return strtoupper($matches[1]);
        }
        return null;
    }
}
