<?php

namespace App\Services;

use App\Models\LoyaltyPoint;
use App\Models\Referral;
use App\Models\UserLoyaltyProfile;
use Illuminate\Support\Str;

class ReferralService
{
    public function generateCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Referral::where('code', $code)->exists());

        return $code;
    }

    public function applyReferral(string $code, $newUser): array
    {
        $referral = Referral::where('code', $code)
            ->where('status', 'active')
            ->first();

        if (! $referral) {
            return [
                'success' => false,
                'message' => 'Invalid or inactive referral code.',
            ];
        }

        if ($referral->referrer_id === $newUser->id) {
            return [
                'success' => false,
                'message' => 'You cannot use your own referral code.',
            ];
        }

        $bonusAmount = 100;

        $referral->update([
            'referred_id' => $newUser->id,
            'status' => 'completed',
            'bonus_amount' => $bonusAmount,
            'referred_at' => now(),
        ]);

        $this->addPoints($referral->referrer_id, $bonusAmount, 'Referral bonus - referred a new user');
        $this->addPoints($newUser->id, $bonusAmount, 'Referral bonus - joined via referral code');

        return [
            'success' => true,
            'referrer_bonus' => $bonusAmount,
            'new_user_bonus' => $bonusAmount,
        ];
    }

    private function addPoints(int $userId, int $points, string $description): void
    {
        LoyaltyPoint::create([
            'user_id' => $userId,
            'points' => $points,
            'type' => 'earned',
            'description' => $description,
        ]);

        $profile = UserLoyaltyProfile::firstOrCreate(
            ['user_id' => $userId],
            ['total_points' => 0, 'available_points' => 0, 'tier' => 'bronze']
        );

        $profile->increment('total_points', $points);
        $profile->increment('available_points', $points);

        $tier = match (true) {
            $profile->total_points >= 5000 => 'platinum',
            $profile->total_points >= 2000 => 'gold',
            $profile->total_points >= 500 => 'silver',
            default => 'bronze',
        };

        $profile->update(['tier' => $tier]);
    }
}
