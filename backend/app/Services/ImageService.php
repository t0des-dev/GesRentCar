<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    /**
     * Optimize and store an image.
     * Resizes to max width and converts to WebP if possible, or optimizes JPEG.
     */
    public function optimizeAndStore(UploadedFile $file, string $directory, int $maxWidth = 1920, int $quality = 80): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = time() . '_' . uniqid() . '.webp';
        $tempPath = $file->getRealPath();

        // Load image based on type
        switch (strtolower($extension)) {
            case 'jpeg':
            case 'jpg':
                $img = imagecreatefromjpeg($tempPath);
                break;
            case 'png':
                $img = imagecreatefrompng($tempPath);
                imagepalettetotruecolor($img);
                imagealphablending($img, true);
                imagesavealpha($img, true);
                break;
            case 'webp':
                $img = imagecreatefromwebp($tempPath);
                break;
            default:
                // If not supported, just store as is
                return $file->store($directory, 'public');
        }

        // Resize logic
        $width = imagesx($img);
        $height = imagesy($img);

        if ($width > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = floor($height * ($maxWidth / $width));
            $tmpImg = imagecreatetruecolor($newWidth, $newHeight);
            
            // Preserve transparency for PNG/WebP
            imagealphablending($tmpImg, false);
            imagesavealpha($tmpImg, true);
            
            imagecopyresampled($tmpImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($img);
            $img = $tmpImg;
        }

        // Save as WebP for best compression
        $path = $directory . '/' . $name;
        $fullPath = storage_path('app/public/' . $path);
        
        // Ensure directory exists
        if (!file_exists(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0755, true);
        }

        imagewebp($img, $fullPath, $quality);
        imagedestroy($img);

        return Storage::url($path);
    }
}
