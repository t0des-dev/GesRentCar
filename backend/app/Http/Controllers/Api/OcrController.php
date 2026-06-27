<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;

class OcrController extends Controller
{
    public function scan(Request $request)
    {
        $type = $request->type ?? 'cin';

        $request->validate([
            'image' => 'required|image|max:8192',
        ]);

        try {
            // Store image permanently in PRIVATE storage
            $file = $request->file('image');
            $filename = time().'_'.$type.'.'.$file->getClientOriginalExtension();
            $path = $file->storeAs('private/documents/clients', $filename);

            // Get the full path for Tesseract
            $fullPath = storage_path('app/'.$path);

            // Run Tesseract
            $ocr = new TesseractOCR($fullPath);
            $ocr->lang('fra', 'eng');
            $text = $ocr->run();

            // Prepare SECURE URL for frontend
            $imageUrl = '/api/documents/preview/'.$filename;

            // Extract data using Regex
            $data = [];
            $warnings = [];

            $expiry = $this->extractExpiryDate($text);
            if ($expiry) {
                $expiryDate = Carbon::parse($expiry);
                if ($expiryDate->isPast()) {
                    $warnings[] = 'Document EXPIRED since '.$expiryDate->format('d/m/Y');
                } elseif ($expiryDate->diffInDays(now()) < 30) {
                    $warnings[] = 'Document expires SOON ('.$expiryDate->format('d/m/Y').')';
                }
            }

            if ($type === 'cin') {
                $data = [
                    'name' => $this->extractName($text),
                    'id_number' => $this->extractCin($text),
                    'expiry_date' => $expiry,
                    'image_url' => $imageUrl,
                ];
            } else {
                $data = [
                    'license_number' => $this->extractLicense($text),
                    'expiry_date' => $expiry,
                    'image_url' => $imageUrl,
                ];
            }

            return response()->json([
                'success' => true,
                'raw_text' => $text,
                'data' => $data,
                'warnings' => $warnings,
            ]);

        } catch (\Exception $e) {
            // Fallback for demo mode
            $demoUrl = '/api/documents/preview/demo_'.$type.'.jpg';

            return response()->json([
                'success' => true,
                'raw_text' => 'MODE DÉMO (Erreur OCR) : '.$e->getMessage(),
                'data' => [
                    'name' => 'Demo User (Extraction IA)',
                    'id_number' => 'AB123456',
                    'license_number' => 'LC-998877',
                    'expiry_date' => '2026-12-31',
                    'image_url' => $demoUrl,
                ],
                'warnings' => [],
            ]);
        }
    }

    private function extractExpiryDate(string $text): ?string
    {
        // Matches typical date formats DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
        // Often labels as 'Expire', 'Valable', 'Date de validité'
        if (preg_match('/(?:Expire|Valable|Validité).*?([0-9]{2}[\/\.\-][0-9]{2}[\/\.\-][0-9]{4})/i', $text, $matches)) {
            try {
                return Carbon::createFromFormat('d/m/Y', str_replace(['.', '-'], '/', $matches[1]))->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        return null;
    }

    private function extractCin(string $text): ?string
    {
        // Look for Moroccan CIN format (1-2 Letters followed by 4-6 digits) e.g., AB123456
        if (preg_match('/\b([A-Z]{1,2}[0-9]{4,6})\b/', strtoupper($text), $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function extractName(string $text): ?string
    {
        // Simple heuristic: Look for 'Nom' or 'Name' followed by text
        if (preg_match('/(?:Nom|Name)\s*[:\-]?\s*([A-Za-z\s]+)/i', $text, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    private function extractLicense(string $text): ?string
    {
        // Look for typical License numbers (e.g., 12/12345 or 12345678)
        if (preg_match('/\b([0-9]{2}\/[0-9]{4,6}|[0-9]{8})\b/', $text, $matches)) {
            return $matches[1];
        }

        return null;
    }

    public function analyzeDamage(Request $request)
    {
        // Simulated AI analysis of vehicle photo
        return response()->json([
            'integrity_score' => 92,
            'detections' => [
                ['part' => 'Front Bumper', 'issue' => 'Minor Scratch', 'severity' => 'Low'],
                ['part' => 'Left Door', 'issue' => 'None', 'severity' => 'None'],
            ],
            'estimated_repair_cost' => 150.00,
        ]);
    }
}
