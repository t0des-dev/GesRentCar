<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Waitlist;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class WaitlistController extends Controller
{
    public function index(Request $request)
    {
        try {
            $waitlists = Waitlist::with(['vehicle', 'user'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json($waitlists);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch waitlists.', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
                'vehicle_id' => 'required|exists:vehicles,id',
                'desired_start_date' => 'required|date|after_or_equal:today',
                'desired_end_date' => 'required|date|after_or_equal:desired_start_date',
                'phone' => 'nullable|string|max:20',
                'user_id' => 'nullable|exists:users,id',
            ]);

            $data['status'] = 'pending';

            $waitlist = Waitlist::create($data);

            return response()->json($waitlist, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create waitlist entry.', 'message' => $e->getMessage()], 500);
        }
    }

    public function notifyAvailable(Waitlist $waitlist)
    {
        try {
            $waitlist->update([
                'status' => 'notified',
                'notified_at' => Carbon::now(),
            ]);

            return response()->json(['message' => 'Waitlist entry marked as notified.', 'waitlist' => $waitlist]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to mark as notified.', 'message' => $e->getMessage()], 500);
        }
    }

    public function cleanupExpired()
    {
        try {
            $expiredCount = Waitlist::where('status', 'pending')
                ->where('created_at', '<', Carbon::now()->subDays(30))
                ->update(['status' => 'expired']);

            return response()->json(['message' => "Marked {$expiredCount} expired waitlist entries."]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to cleanup expired entries.', 'message' => $e->getMessage()], 500);
        }
    }
}
