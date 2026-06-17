<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Maintenance::query();
        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        return response()->json($query->orderBy('maintenance_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'type' => 'required|string',
            'description' => 'required|string',
            'cost' => 'required|numeric',
            'maintenance_date' => 'required|date',
        ]);

        $maintenance = Maintenance::create($data);

        // Mettre à jour le statut du véhicule si nécessaire
        Vehicle::find($data['vehicle_id'])->update(['status' => 'maintenance']);

        return response()->json($maintenance, 201);
    }

    public function destroy(Maintenance $maintenance)
    {
        $maintenance->delete();

        return response()->json(null, 204);
    }
}
