<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    public function index(Request $request, \App\Services\PricingService $pricing)
    {
        $query = Vehicle::query();

        if ($request->has(['start_date', 'end_date'])) {
            $query->available($request->start_date, $request->end_date);
        }

        if ($request->has('ids')) {
            $ids = is_array($request->ids) ? $request->ids : explode(',', $request->ids);
            $query->whereIn('id', $ids);
        }

        if ($request->has('brand')) {
            $query->where('brand', 'like', '%' . $request->brand . '%');
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
        $vehicles = $query->paginate($perPage);

        $vehicles->getCollection()->transform(function ($vehicle) use ($pricing) {
            $dynamic = $pricing->getDynamicRate($vehicle);
            $vehicle->dynamic_price = $dynamic['price'];
            $vehicle->dynamic_reason = $dynamic['reason'];
            
            // Stats Financières (ROI)
            $vehicle->total_revenue = $vehicle->reservations()->whereIn('status', ['completed', 'ongoing', 'confirmed'])->sum('total_price');
            $vehicle->total_maintenance_cost = $vehicle->maintenances()->sum('cost');

            // Calcul Auto du Statut (si pas en maintenance forcée)
            if ($vehicle->status !== 'maintenance') {
                $isCurrentlyRented = $vehicle->reservations()
                    ->whereIn('status', ['ongoing', 'confirmed'])
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->exists();
                if ($isCurrentlyRented) {
                    $vehicle->status = 'rented';
                } else {
                    $vehicle->status = 'available';
                }
            }
            
            return $vehicle;
        });

        return response()->json($vehicles);
    }

    public function show(Vehicle $vehicle)
    {
        return response()->json($vehicle->load('agent'));
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
            'commission_rate' => 'nullable|numeric',
            'image_url' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'mileage' => 'nullable|integer',
            'insurance_date' => 'nullable|date',
            'tech_inspection_date' => 'nullable|date',
            'vignette_date' => 'nullable|date',
        ]);

        $vehicle = Vehicle::create($data);
        return response()->json($vehicle, 201);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $data = $request->validate([
            'brand' => 'sometimes|string',
            'model' => 'sometimes|string',
            'plate' => 'sometimes|string|unique:vehicles,plate,' . $vehicle->id,
            'price_per_day' => 'sometimes|numeric',
            'status' => 'sometimes|in:available,rented,maintenance',
            'category' => 'sometimes|string',
            'commission_rate' => 'nullable|numeric',
            'image_url' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'mileage' => 'nullable|integer',
            'insurance_date' => 'nullable|date',
            'tech_inspection_date' => 'nullable|date',
            'vignette_date' => 'nullable|date',
        ]);

        $vehicle->update($data);
        return response()->json($vehicle);
    }

    public function uploadImage(Request $request, Vehicle $vehicle)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vehicles', 'public');
            $url = Storage::url($path);
            $vehicle->update(['image_url' => $url]);
            return response()->json(['url' => $url]);
        }

        return response()->json(['message' => 'Aucun fichier'], 400);
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->json(null, 204);
    }
}
