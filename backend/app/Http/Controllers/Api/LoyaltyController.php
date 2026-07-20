<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPoint;
use App\Models\UserLoyaltyProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LoyaltyController extends Controller
{
    public function pointsHistory(Request $request)
    {
        try {
            $history = LoyaltyPoint::where('user_id', $request->user()->id)
                ->with('reservation')
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json($history);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch points history.', 'message' => $e->getMessage()], 500);
        }
    }

    public function profile(Request $request)
    {
        try {
            $profile = UserLoyaltyProfile::firstOrCreate(
                ['user_id' => $request->user()->id],
                ['total_points' => 0, 'available_points' => 0, 'tier' => 'bronze']
            );

            return response()->json([
                'user_id' => $profile->user_id,
                'total_points' => $profile->total_points,
                'available_points' => $profile->available_points,
                'tier' => $profile->tier,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch loyalty profile.', 'message' => $e->getMessage()], 500);
        }
    }

    public function earn(Request $request)
    {
        try {
            $data = $request->validate([
                'points' => 'required|integer|min:1',
                'description' => 'nullable|string',
                'reservation_id' => 'nullable|exists:reservations,id',
            ]);

            $userId = $request->user()->id;

            LoyaltyPoint::create([
                'user_id' => $userId,
                'points' => $data['points'],
                'type' => 'earned',
                'description' => $data['description'] ?? 'Points earned',
                'reservation_id' => $data['reservation_id'] ?? null,
            ]);

            $profile = UserLoyaltyProfile::firstOrCreate(
                ['user_id' => $userId],
                ['total_points' => 0, 'available_points' => 0, 'tier' => 'bronze']
            );

            $profile->increment('total_points', $data['points']);
            $profile->increment('available_points', $data['points']);
            $profile->update(['tier' => $this->calculateTier($profile->total_points)]);

            return response()->json([
                'message' => 'Points earned successfully.',
                'points_added' => $data['points'],
                'new_total' => $profile->total_points,
                'new_available' => $profile->available_points,
                'tier' => $profile->tier,
            ]);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to earn points.', 'message' => $e->getMessage()], 500);
        }
    }

    public function redeem(Request $request)
    {
        try {
            $data = $request->validate([
                'points' => 'required|integer|min:1',
                'description' => 'nullable|string',
            ]);

            $userId = $request->user()->id;

            $profile = UserLoyaltyProfile::where('user_id', $userId)->first();

            if (! $profile || $profile->available_points < $data['points']) {
                return response()->json(['error' => 'Insufficient available points.'], 422);
            }

            LoyaltyPoint::create([
                'user_id' => $userId,
                'points' => -$data['points'],
                'type' => 'redeemed',
                'description' => $data['description'] ?? 'Points redeemed as discount',
            ]);

            $profile->decrement('available_points', $data['points']);
            $profile->update(['tier' => $this->calculateTier($profile->total_points)]);

            return response()->json([
                'message' => 'Points redeemed successfully.',
                'points_redeemed' => $data['points'],
                'new_total' => $profile->total_points,
                'new_available' => $profile->available_points,
                'tier' => $profile->tier,
            ]);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to redeem points.', 'message' => $e->getMessage()], 500);
        }
    }

    public function calculateTier(int $totalPoints): string
    {
        return match (true) {
            $totalPoints >= 5000 => 'platinum',
            $totalPoints >= 2000 => 'gold',
            $totalPoints >= 500 => 'silver',
            default => 'bronze',
        };
    }
}
