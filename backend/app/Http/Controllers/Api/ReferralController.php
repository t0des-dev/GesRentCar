<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Services\ReferralService;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function __construct(
        private ReferralService $referralService
    ) {}

    public function generateCode(Request $request)
    {
        try {
            $user = $request->user();

            $existingReferral = Referral::where('referrer_id', $user->id)->first();

            if ($existingReferral) {
                return response()->json([
                    'code' => $existingReferral->code,
                ]);
            }

            $code = $this->referralService->generateCode();

            Referral::create([
                'referrer_id' => $user->id,
                'code' => $code,
                'status' => 'active',
            ]);

            return response()->json([
                'code' => $code,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate referral code.', 'message' => $e->getMessage()], 500);
        }
    }

    public function apply(Request $request)
    {
        try {
            $data = $request->validate([
                'code' => 'required|string|size:8',
            ]);

            $newUser = $request->user();

            $result = $this->referralService->applyReferral($data['code'], $newUser);

            if (! $result['success']) {
                return response()->json(['error' => $result['message']], 422);
            }

            return response()->json([
                'message' => 'Referral applied successfully.',
                'referrer_bonus' => $result['referrer_bonus'],
                'new_user_bonus' => $result['new_user_bonus'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to apply referral.', 'message' => $e->getMessage()], 500);
        }
    }

    public function stats(Request $request)
    {
        try {
            $user = $request->user();

            $totalReferred = Referral::where('referrer_id', $user->id)
                ->where('status', 'completed')
                ->count();

            $bonusesEarned = Referral::where('referrer_id', $user->id)
                ->where('status', 'completed')
                ->sum('bonus_amount');

            return response()->json([
                'total_referred' => $totalReferred,
                'bonuses_earned' => $bonusesEarned,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch referral stats.', 'message' => $e->getMessage()], 500);
        }
    }
}
