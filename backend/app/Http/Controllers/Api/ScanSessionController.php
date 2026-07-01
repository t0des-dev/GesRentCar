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

    public function show(ScanSession $session): JsonResponse
    {
        if ($session->isExpired() && $session->status !== 'completed') {
            $session->update(['status' => 'expired']);
        }

        return response()->json([
            'data' => $session->toArray(),
        ]);
    }

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

        $file = $request->file('image');
        $filename = 'scan_' . $session->token . '_' . $validated['type'] . '.' . $file->getClientOriginalExtension();
        $dir = storage_path('app/private/documents/clients');
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        $file->storeAs('documents/clients', $filename);
        $fullPath = $dir . '/' . $filename;
        $imageUrl = '/api/documents/preview/' . $filename;

        $data = ['image_url' => $imageUrl];

        if (!file_exists($fullPath)) {
            return response()->json([
                'success' => false,
                'message' => 'Image non sauvegardée. fullPath=' . $fullPath,
            ], 500);
        }

        // Preprocess image for better OCR accuracy
        $preprocessedPath = $this->preprocessImage($fullPath);

        if (!file_exists($preprocessedPath)) {
            $preprocessedPath = $fullPath;
        }

        try {
            $ocr = new TesseractOCR($preprocessedPath);
            $ocr->lang('fra', 'eng', 'ara');
            $text = $ocr->run();

            if ($validated['type'] === 'cin') {
                $data['name'] = $this->extractName($text);
                $data['id_number'] = $this->extractCin($text);

                if (empty($data['name']) && empty($data['id_number'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Impossible de lire le texte sur l\'image. Veuillez réessayer avec un meilleur éclairage.',
                        'data' => $data,
                    ], 422);
                }
            } else {
                $data['license_number'] = $this->extractLicense($text);

                if (empty($data['license_number'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Impossible de lire le numéro de permis. Veuillez réessayer.',
                        'data' => $data,
                    ], 422);
                }
            }
        } catch (\Exception $e) {
            $msg = $e->getMessage();
            return response()->json([
                'success' => false,
                'message' => 'Erreur OCR : ' . $msg,
            ], 500);
        } finally {
            // Clean up preprocessed temp file
            if (isset($preprocessedPath) && $preprocessedPath !== $fullPath && file_exists($preprocessedPath)) {
                @unlink($preprocessedPath);
            }
        }

        $update = ['status' => 'scanning'];
        if ($validated['type'] === 'cin') {
            $update['cin_name'] = $data['name'] ?? null;
            $update['cin_number'] = $data['id_number'] ?? null;
            $update['cin_image_url'] = $data['image_url'] ?? null;
        } else {
            $update['license_number'] = $data['license_number'] ?? null;
            $update['license_image_url'] = $data['image_url'] ?? null;
        }

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

    private function preprocessImage(string $path): string
    {
        $info = @getimagesize($path);
        if (!$info) {
            return $path;
        }

        $preprocessedPath = dirname($path) . '/pre_' . basename($path);

        switch ($info[2]) {
            case IMAGETYPE_JPEG:
                $img = @imagecreatefromjpeg($path);
                break;
            case IMAGETYPE_PNG:
                $img = @imagecreatefrompng($path);
                break;
            case IMAGETYPE_GIF:
                $img = @imagecreatefromgif($path);
                break;
            default:
                return $path;
        }

        if (!$img) {
            return $path;
        }

        $width = imagesx($img);
        $height = imagesy($img);

        // Resize if too large (Tesseract works best at ~300 DPI)
        $maxDim = 2000;
        if ($width > $maxDim || $height > $maxDim) {
            $ratio = min($maxDim / $width, $maxDim / $height);
            $resized = imagecreatetruecolor((int)($width * $ratio), (int)($height * $ratio));
            imagecopyresampled($resized, $img, 0, 0, 0, 0, (int)($width * $ratio), (int)($height * $ratio), $width, $height);
            imagedestroy($img);
            $img = $resized;
        }

        imagefilter($img, IMG_FILTER_GRAYSCALE);
        imagefilter($img, IMG_FILTER_CONTRAST, -30);

        imagejpeg($img, $preprocessedPath, 90);
        imagedestroy($img);

        return $preprocessedPath;
    }

    private function extractCin(string $text): ?string
    {
        // Format 1: 1-3 letters + 4-7 digits (Moroccan CIN, passport, etc.)
        if (preg_match('/\b([A-Z]{1,3}\s*[0-9]{4,7})\b/i', $text, $matches)) {
            return preg_replace('/\s+/', '', strtoupper($matches[1]));
        }
        // Format 2: 9-12 consecutive digits (French/European ID)
        if (preg_match('/\b([0-9]{9,12})\b/', $text, $matches)) {
            return $matches[1];
        }
        // Format 3: Single letter + 5-8 digits (passport)
        if (preg_match('/\b([A-Z][0-9]{5,8})\b/i', $text, $matches)) {
            return strtoupper($matches[1]);
        }
        return null;
    }

    private function extractName(string $text): ?string
    {
        // Try labeled French fields: NOM + PRÉNOM (order: NOM first is more common on CIN)
        if (preg_match('/(?:NOM|Name|Surname|Nom|Family)\s*[:\-=\.]?\s*([A-Za-zÀ-ÿ\s\-]+)/iu', $text, $nomMatches)) {
            $nom = trim($nomMatches[1]);
            if (preg_match('/(?:PR[ÉE]NOM|PRENOM|Given|Prénom)\s*[:\-=\.]?\s*([A-Za-zÀ-ÿ\s\-]+)/iu', $text, $matches)) {
                $prenom = trim($matches[1]);
                if (strtolower($nom) !== strtolower($prenom)) {
                    return $nom . ' ' . $prenom;
                }
            }
            return $nom;
        }
        if (preg_match('/(?:PR[ÉE]NOM|PRENOM|Given|Prénom)\s*[:\-=\.]?\s*([A-Za-zÀ-ÿ\s\-]+)/iu', $text, $matches)) {
            return trim($matches[1]);
        }
        // Fallback: two consecutive capitalized words (at least 2 chars each)
        if (preg_match('/\b([A-ZÀ-Ý]{2,})\s+([A-ZÀ-Ý]{2,})\b/u', $text, $matches)) {
            return $matches[1] . ' ' . $matches[2];
        }
        return null;
    }

    private function extractLicense(string $text): ?string
    {
        // Format 1: XX/XXXXX (Moroccan license - exactly 5 digits after slash, not 4 which is a year)
        if (preg_match('/\b([0-9]{2}\s*\/\s*[0-9]{5})\b/', $text, $matches)) {
            return preg_replace('/\s+/', '', $matches[1]);
        }
        // Format 2: 8 consecutive digits
        if (preg_match('/\b([0-9]{8})\b/', $text, $matches)) {
            return $matches[1];
        }
        // Format 3: Alphanumeric (e.g., 12AB3456, 12-AB-3456)
        if (preg_match('/\b([0-9]{1,3}\s*[A-Z]{1,3}\s*[0-9]{3,6})\b/i', $text, $matches)) {
            return strtoupper(preg_replace('/\s+/', '', $matches[1]));
        }
        // Format 4: European format (1-3 letters + digits)
        if (preg_match('/\b([A-Z]{1,3}\s*[0-9]{4,8})\b/i', $text, $matches)) {
            return strtoupper(preg_replace('/\s+/', '', $matches[1]));
        }
        return null;
    }
}
