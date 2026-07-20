<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleImportController extends Controller
{
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation échouée.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        if ($handle === false) {
            return response()->json([
                'message' => 'Impossible d\'ouvrir le fichier.',
            ], 500);
        }

        $headers = fgetcsv($handle, 0, ',');
        $headerMap = array_map('strtolower', array_map('trim', $headers));

        $columnMap = [
            'brand' => array_search('brand', $headerMap) !== false ? array_search('brand', $headerMap) : null,
            'model' => array_search('model', $headerMap) !== false ? array_search('model', $headerMap) : null,
            'plate' => array_search('plate', $headerMap) !== false ? array_search('plate', $headerMap) : null,
            'price_per_day' => array_search('price_per_day', $headerMap) !== false ? array_search('price_per_day', $headerMap) : null,
            'category' => array_search('category', $headerMap) !== false ? array_search('category', $headerMap) : null,
            'status' => array_search('status', $headerMap) !== false ? array_search('status', $headerMap) : null,
            'year' => array_search('year', $headerMap) !== false ? array_search('year', $headerMap) : null,
            'fuel_type' => array_search('fuel_type', $headerMap) !== false ? array_search('fuel_type', $headerMap) : null,
            'mileage' => array_search('mileage', $headerMap) !== false ? array_search('mileage', $headerMap) : null,
        ];

        $existingPlates = Vehicle::pluck('plate')->map(fn ($p) => strtolower(trim($p)))->toArray();
        $imported = 0;
        $skipped = 0;
        $errors = [];
        $rowNumber = 1;

        while (($row = fgetcsv($handle, 0, ',')) !== false) {
            $rowNumber++;

            if (count($row) < count(array_filter($columnMap))) {
                $errors[] = "Ligne {$rowNumber} : colonnes manquantes.";

                continue;
            }

            $plate = trim($row[$columnMap['plate']] ?? '');

            if (in_array(strtolower($plate), $existingPlates)) {
                $skipped++;

                continue;
            }

            $vehicleData = [
                'brand' => trim($row[$columnMap['brand']] ?? ''),
                'model' => trim($row[$columnMap['model']] ?? ''),
                'plate' => $plate,
                'price_per_day' => (float) ($row[$columnMap['price_per_day']] ?? 0),
                'category' => trim($row[$columnMap['category']] ?? ''),
                'status' => trim($row[$columnMap['status']] ?? 'available'),
                'year' => (int) ($row[$columnMap['year']] ?? date('Y')),
                'fuel_type' => trim($row[$columnMap['fuel_type']] ?? ''),
                'mileage' => (int) ($row[$columnMap['mileage']] ?? 0),
            ];

            $vehicleValidator = Validator::make($vehicleData, [
                'brand' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'plate' => 'required|string|max:20|unique:vehicles,plate',
                'price_per_day' => 'required|numeric|min:0',
                'category' => 'required|string|max:255',
                'status' => 'required|string|in:available,rented,maintenance',
                'year' => 'required|integer|min:1900|max:'.(date('Y') + 1),
                'fuel_type' => 'required|string|max:100',
                'mileage' => 'integer|min:0',
            ]);

            if ($vehicleValidator->fails()) {
                $errors[] = "Ligne {$rowNumber} ({$plate}) : ".$vehicleValidator->errors()->first();

                continue;
            }

            Vehicle::create($vehicleData);
            $existingPlates[] = strtolower($plate);
            $imported++;
        }

        fclose($handle);

        return response()->json([
            'message' => "Import terminé. {$imported} véhicule(s) importé(s), {$skipped} doublon(s) ignoré(s).",
            'imported' => $imported,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }
}
