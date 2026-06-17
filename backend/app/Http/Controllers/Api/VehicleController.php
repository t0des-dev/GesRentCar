<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\ImageService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VehicleController extends Controller
{
    public function index(Request $request, PricingService $pricing)
    {
        $version = Cache::get('vehicles_cache_version', 1);
        $cacheKey = 'vehicles_index_v2_'.$version.'_'.md5(json_encode($request->all()).app()->getLocale());

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($request, $pricing) {
            $query = Vehicle::query();

            if ($request->has(['start_date', 'end_date'])) {
                $query->available($request->start_date, $request->end_date);
            }

            if ($request->has('ids')) {
                $ids = is_array($request->ids) ? $request->ids : explode(',', $request->ids);
                $query->whereIn('id', $ids);
            }

            if ($request->has('brand')) {
                $query->where('brand', 'like', '%'.$request->brand.'%');
            }

            if ($request->has('type')) {
                $type = strtolower($request->type);
                if (in_array($type, ['internal', 'collaborator'])) {
                    $query->where('type', $type);
                } else {
                    $query->where('category', $type);
                }
            }

            if ($request->has('category')) {
                $query->where('category', strtolower($request->category));
            }

            if ($request->has('max_price')) {
                $query->where('price_per_day', '<=', $request->max_price);
            }

            $perPage = $request->query('per_page', 6);

            $vehicles = $query->withSum(['reservations as total_revenue' => function ($q) {
                $q->whereIn('status', ['completed', 'ongoing', 'confirmed']);
            }], 'total_price')
                ->withSum('maintenances as total_maintenance_cost', 'cost')
                ->withExists(['reservations as is_currently_rented' => function ($q) {
                    $q->whereIn('status', ['ongoing', 'confirmed'])
                        ->where('start_date', '<=', now())
                        ->where('end_date', '>=', now());
                }])
                ->paginate($perPage);

            $totalVehicles = Vehicle::count();
            $rentedVehicles = Vehicle::where('status', 'rented')->count();
            $occupancyRate = $totalVehicles > 0 ? ($rentedVehicles / $totalVehicles) : 0;

            $vehicles->getCollection()->transform(function ($vehicle) use ($pricing, $occupancyRate) {
                $dynamic = $pricing->getDynamicRate($vehicle, $occupancyRate);
                $vehicle->dynamic_price = $dynamic['price'];
                $vehicle->dynamic_reason = $dynamic['reason'];

                // Calcul Auto du Statut (si pas en maintenance forcée)
                if ($vehicle->status !== 'maintenance') {
                    $vehicle->status = $vehicle->is_currently_rented ? 'rented' : 'available';
                }

                return $vehicle;
            });

            return response()->json($vehicles);
        });
    }

    protected function clearCache()
    {
        $version = Cache::get('vehicles_cache_version', 1);
        Cache::put('vehicles_cache_version', $version + 1);
    }

    public function show(Vehicle $vehicle)
    {
        $vehicle->load(['agent', 'reservations', 'maintenances']);

        $vehicle->loadSum(['reservations as total_revenue' => function ($q) {
            $q->whereIn('status', ['completed', 'ongoing', 'confirmed']);
        }], 'total_price');

        $vehicle->loadSum('maintenances as total_maintenance_cost', 'cost');

        return response()->json($vehicle);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'plate' => 'required|string|unique:vehicles',
            'price_per_day' => 'required|numeric',
            'type' => 'required|in:internal,collaborator',
            'status' => 'required|in:available,rented,maintenance',
            'category' => 'required|string',
            'fuel_type' => 'nullable|string',
            'horsepower' => 'nullable|string',
            'year' => 'nullable|integer',
            'color' => 'nullable|string',
            'commission_rate' => 'nullable|numeric',
            'image_url' => 'nullable|string',
            'photos' => 'nullable|array',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'mileage' => 'nullable|integer',
            'insurance_date' => 'nullable|date',
            'tech_inspection_date' => 'nullable|date',
            'vignette_date' => 'nullable|date',
        ]);

        $vehicle = Vehicle::create($data);
        $this->clearCache();

        return response()->json($vehicle, 201);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $data = $request->validate([
            'brand' => 'sometimes|string',
            'model' => 'sometimes|string',
            'plate' => 'sometimes|string|unique:vehicles,plate,'.$vehicle->id,
            'price_per_day' => 'sometimes|numeric',
            'status' => 'sometimes|in:available,rented,maintenance',
            'category' => 'sometimes|string',
            'fuel_type' => 'nullable|string',
            'horsepower' => 'nullable|string',
            'year' => 'nullable|integer',
            'color' => 'nullable|string',
            'commission_rate' => 'nullable|numeric',
            'image_url' => 'nullable|string',
            'photos' => 'nullable|array',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'mileage' => 'nullable|integer',
            'insurance_date' => 'nullable|date',
            'tech_inspection_date' => 'nullable|date',
            'vignette_date' => 'nullable|date',
        ]);

        $vehicle->update($data);
        $this->clearCache();

        return response()->json($vehicle);
    }

    public function uploadImage(Request $request, Vehicle $vehicle, ImageService $imageService)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            if ($request->hasFile('image')) {
                $url = $imageService->optimizeAndStore($request->file('image'), 'vehicles');
                $vehicle->update(['image_url' => $url]);
                $this->clearCache();

                return response()->json(['url' => $url]);
            }

            return response()->json(['message' => 'Aucun fichier'], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur upload: '.$e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function uploadPhotos(Request $request, Vehicle $vehicle, ImageService $imageService)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $currentPhotos = $vehicle->photos ?? [];

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $currentPhotos[] = $imageService->optimizeAndStore($photo, 'vehicles/gallery');
            }
            $vehicle->update(['photos' => $currentPhotos]);
            $this->clearCache();

            return response()->json(['photos' => $currentPhotos]);
        }

        return response()->json(['message' => 'Aucun fichier'], 400);
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        $this->clearCache();

        return response()->json(null, 204);
    }
}
