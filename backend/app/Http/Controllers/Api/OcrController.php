<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    public function scan(Request $request)
    {
        $type = $request->type ?? 'cin';
        
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        try {
            // Save image temporarily
            $path = $request->file('image')->store('temp', 'local');
            $fullPath = storage_path('app/private/' . $path);

            if (!file_exists($fullPath)) {
                // Fallback for different Laravel storage paths
                $fullPath = storage_path('app/' . $path);
            }

            // Run Tesseract
            $ocr = new \thiagoalessio\TesseractOCR\TesseractOCR($fullPath);
            // On Windows, if Tesseract is not in PATH, we might need to specify the executable path
            // $ocr->executable('C:\Program Files\Tesseract-OCR\tesseract.exe');
            // We set French and English as languages
            $ocr->lang('fra', 'eng');
            $text = $ocr->run();

            // Delete temp file
            @unlink($fullPath);

            // Extract data using Regex
            if ($type === 'cin') {
                return response()->json([
                    'success' => true,
                    'raw_text' => $text,
                    'data' => [
                        'name' => $this->extractName($text),
                        'id_number' => $this->extractCin($text),
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'raw_text' => $text,
                'data' => [
                    'license_number' => $this->extractLicense($text),
                ]
            ]);

        } catch (\Exception $e) {
            // Fallback pour la démo si Tesseract n'est pas installé sur la machine
            return response()->json([
                'success' => true,
                'raw_text' => 'MODE DÉMO (Tesseract non trouvé) : ' . $e->getMessage(),
                'data' => [
                    'name' => 'Demo User (Fallback)',
                    'id_number' => 'AB123456',
                    'license_number' => 'LC-998877'
                ]
            ]);
        }
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
                ['part' => 'Left Door', 'issue' => 'None', 'severity' => 'None']
            ],
            'estimated_repair_cost' => 150.00
        ]);
    }
}
