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
            $file = $request->file('image');
            $filename = time().'_'.$type.'.'.$file->getClientOriginalExtension();
            $dir = storage_path('app/private/documents/clients');
            if (!is_dir($dir)) {
                mkdir($dir, 0775, true);
            }
            $file->storeAs('documents/clients', $filename);
            $fullPath = $dir . '/' . $filename;
            $imageUrl = '/api/documents/preview/'.$filename;

            // Preprocess image for better OCR
            $preprocessedPath = $this->preprocessImage($fullPath);

            $ocr = new TesseractOCR($preprocessedPath);
            $ocr->lang('fra', 'eng');
            $text = $ocr->run();

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

                if (empty($data['name']) && empty($data['id_number'])) {
                    return response()->json([
                        'success' => false,
                        'raw_text' => $text,
                        'data' => $data,
                        'warnings' => $warnings,
                        'message' => 'Impossible de lire la Carte Nationale. Veuillez réessayer avec un meilleur éclairage.',
                    ], 422);
                }
            } else {
                $data = [
                    'license_number' => $this->extractLicense($text),
                    'expiry_date' => $expiry,
                    'image_url' => $imageUrl,
                ];

                if (empty($data['license_number'])) {
                    return response()->json([
                        'success' => false,
                        'raw_text' => $text,
                        'data' => $data,
                        'warnings' => $warnings,
                        'message' => 'Impossible de lire le Permis de Conduire. Veuillez réessayer.',
                    ], 422);
                }
            }

            return response()->json([
                'success' => true,
                'raw_text' => $text,
                'data' => $data,
                'warnings' => $warnings,
            ]);

        } catch (\Exception $e) {
            $msg = $e->getMessage();
            if (str_contains($msg, 'not installed') || str_contains($msg, 'not found') || str_contains($msg, 'No such file') || str_contains($msg, 'Cannot find')) {
                $message = 'Le service OCR (Tesseract) n\'est pas installé sur le serveur. Contactez l\'administrateur.';
            } else {
                $message = 'Erreur de traitement de l\'image. Veuillez réessayer.';
            }
            return response()->json([
                'success' => false,
                'raw_text' => null,
                'data' => [
                    'image_url' => $imageUrl ?? null,
                ],
                'warnings' => [],
                'message' => $message,
            ], 500);
        } finally {
            if (isset($preprocessedPath) && $preprocessedPath !== $fullPath && file_exists($preprocessedPath)) {
                @unlink($preprocessedPath);
            }
        }
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

    private function extractExpiryDate(string $text): ?string
    {
        if (preg_match('/(?:Expire|Valable|Validité|Exp|Date).*?([0-9]{2}[\/\.\-][0-9]{2}[\/\.\-][0-9]{4})/i', $text, $matches)) {
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
        // Format 1: 1-3 letters + 4-8 digits (Moroccan CIN like K01234567)
        if (preg_match('/\b([A-Z]{1,3}\s*[0-9]{4,8})\b/i', $text, $matches)) {
            return preg_replace('/\s+/', '', strtoupper($matches[1]));
        }
        // Format 2: Single letter + 5-8 digits (passport)
        if (preg_match('/\b([A-Z][0-9]{5,8})\b/i', $text, $matches)) {
            return strtoupper($matches[1]);
        }
        // Format 3: 9-12 digit French/European ID
        if (preg_match('/\b([0-9]{9,12})\b/', $text, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function extractName(string $text): ?string
    {
        // Try labeled French fields: NOM + PRÉNOM
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
        // Fallback: scan all lines for ALL-CAPS Latin words, skip known CIN headers/fields
        $lines = preg_split('/\r?\n/', $text);
        $skipWords = '/ROYAUME|MAROC|CARTE|IDENTIT|NATIONAL|PASSPORT|NUM[ÉE]RO|DATE|LIEU|TAILLE|N[ÉE]|VALABLE|SIGNALEMENT|PROFIL|FILS|PERMISSION|ADRESSE|CIN|DROIT|AL|ASSILAH|TANGER|CASABLANCA|RABAT|FES|MARRAKECH/i';
        $candidates = [];
        foreach ($lines as $line) {
            $trim = trim($line);
            if ($trim === '') continue;
            if (preg_match($skipWords, $trim)) continue;
            // Must be ALL-CAPS Latin text (typical for names on CIN)
            if (preg_match('/^[A-ZÀ-Ý][A-ZÀ-Ý\s\-]+[A-ZÀ-Ý]$/', $trim)) {
                $candidates[] = $trim;
            }
            if (count($candidates) >= 2) break;
        }
        if (count($candidates) >= 2) {
            return $candidates[0] . ' ' . $candidates[1];
        }
        if (count($candidates) === 1) {
            return $candidates[0];
        }
        return null;
    }

    private function extractLicense(string $text): ?string
    {
        // Format 1: XX/XXXXX or XX/XXXXXX (Moroccan license)
        if (preg_match('/\b([0-9]{2}\s*\/\s*[0-9]{5,6})\b/', $text, $matches)) {
            return preg_replace('/\s+/', '', $matches[1]);
        }
        // Format 2: 8 digits
        if (preg_match('/\b([0-9]{8})\b/', $text, $matches)) {
            return $matches[1];
        }
        // Format 3: Alphanumeric (12AB3456)
        if (preg_match('/\b([0-9]{1,3}\s*[A-Z]{1,3}\s*[0-9]{3,6})\b/i', $text, $matches)) {
            return strtoupper(preg_replace('/\s+/', '', $matches[1]));
        }
        // Format 4: European (ABC12345)
        if (preg_match('/\b([A-Z]{1,3}\s*[0-9]{4,8})\b/i', $text, $matches)) {
            return strtoupper(preg_replace('/\s+/', '', $matches[1]));
        }
        return null;
    }
}
