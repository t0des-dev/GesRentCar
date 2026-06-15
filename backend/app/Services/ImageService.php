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
        try {
            $extension = $file->getClientOriginalExtension();
            $name = time() . '_' . uniqid() . '.webp';
            $tempPath = $file->getRealPath();

            // Load image based on type
            switch (strtolower($extension)) {
                case 'jpeg':
                case 'jpg':
                    if (function_exists('imagecreatefromjpeg')) {
                        $img = imagecreatefromjpeg($tempPath);
                    } else {
                        return Storage::url($file->store($directory, 'public'));
                    }
                    break;
                case 'png':
                    if (function_exists('imagecreatefrompng')) {
                        $img = imagecreatefrompng($tempPath);
                        imagepalettetotruecolor($img);
                        imagealphablending($img, true);
                        imagesavealpha($img, true);
                    } else {
                        return Storage::url($file->store($directory, 'public'));
                    }
                    break;
                case 'webp':
                    if (function_exists('imagecreatefromwebp')) {
                        $img = imagecreatefromwebp($tempPath);
                    } else {
                        return Storage::url($file->store($directory, 'public'));
                    }
                    break;
                default:
                    // If not supported, just store as is
                    return Storage::url($file->store($directory, 'public'));
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

            if (function_exists('imagewebp')) {
                imagewebp($img, $fullPath, $quality);
            } else {
                // Fallback to jpeg if webp is not supported
                $name = str_replace('.webp', '.jpg', $name);
                $path = $directory . '/' . $name;
                $fullPath = storage_path('app/public/' . $path);
                imagejpeg($img, $fullPath, $quality);
            }
            
            imagedestroy($img);

            return Storage::url($path);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Image optimization failed: ' . $e->getMessage());
            return Storage::url($file->store($directory, 'public'));
        }
    }
}
