<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceSchedule;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MaintenanceScheduleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = MaintenanceSchedule::with('vehicle');

            if ($request->has('vehicle_id')) {
                $query->where('vehicle_id', $request->vehicle_id);
            }

            $schedules = $query->orderBy('scheduled_date', 'asc')->get();

            return response()->json($schedules);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch maintenance schedules.', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'vehicle_id' => 'required|exists:vehicles,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'type' => 'required|string',
                'scheduled_date' => 'required|date',
                'estimated_cost' => 'nullable|numeric|min:0',
                'recurring' => 'boolean',
                'recurring_interval_days' => 'nullable|integer|min:1',
                'assigned_to' => 'nullable|exists:users,id',
                'mileage_at_service' => 'nullable|integer|min:0',
            ]);

            $data['status'] = $data['status'] ?? 'pending';

            $schedule = MaintenanceSchedule::create($data);

            return response()->json($schedule, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create maintenance schedule.', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        try {
            $data = $request->validate([
                'status' => 'sometimes|string|in:pending,in_progress,completed,cancelled',
                'actual_cost' => 'nullable|numeric|min:0',
                'completed_date' => 'nullable|date',
                'mileage_at_service' => 'nullable|integer|min:0',
                'notes' => 'nullable|string',
            ]);

            if (isset($data['status']) && $data['status'] === 'completed') {
                $data['completed_date'] = $data['completed_date'] ?? Carbon::now()->toDateString();
            }

            $maintenanceSchedule->update($data);

            return response()->json($maintenanceSchedule);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update maintenance schedule.', 'message' => $e->getMessage()], 500);
        }
    }

    public function overdue()
    {
        try {
            $overdue = MaintenanceSchedule::with('vehicle')
                ->where('status', 'pending')
                ->where('scheduled_date', '<', Carbon::now())
                ->orderBy('scheduled_date', 'asc')
                ->get();

            return response()->json($overdue);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch overdue maintenance.', 'message' => $e->getMessage()], 500);
        }
    }

    public function autoSchedule(Request $request)
    {
        try {
            $data = $request->validate([
                'vehicle_id' => 'required|exists:vehicles,id',
                'type' => 'required|string',
                'title' => 'required|string|max:255',
                'recurring_interval_days' => 'required|integer|min:1',
                'estimated_cost' => 'nullable|numeric|min:0',
            ]);

            $lastCompleted = MaintenanceSchedule::where('vehicle_id', $data['vehicle_id'])
                ->where('type', $data['type'])
                ->where('status', 'completed')
                ->orderBy('completed_date', 'desc')
                ->first();

            if (! $lastCompleted) {
                return response()->json(['error' => 'No completed maintenance found for this type to base scheduling on.'], 404);
            }

            $nextDate = Carbon::parse($lastCompleted->completed_date)->addDays($data['recurring_interval_days']);

            $schedule = MaintenanceSchedule::create([
                'vehicle_id' => $data['vehicle_id'],
                'title' => $data['title'],
                'type' => $data['type'],
                'scheduled_date' => $nextDate,
                'estimated_cost' => $data['estimated_cost'] ?? null,
                'recurring' => true,
                'recurring_interval_days' => $data['recurring_interval_days'],
                'status' => 'pending',
            ]);

            return response()->json($schedule, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to auto-schedule maintenance.', 'message' => $e->getMessage()], 500);
        }
    }
}
