<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Review::with('user')
                ->where('is_approved', true);

            if ($request->has('vehicle_id')) {
                $query->where('vehicle_id', $request->vehicle_id);
            }

            $reviews = $query->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json($reviews);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reviews.', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'vehicle_id' => 'required|exists:vehicles,id',
                'reservation_id' => 'required|exists:reservations,id',
                'rating' => 'required|integer|min:1|max:5',
                'title' => 'nullable|string|max:255',
                'comment' => 'required|string',
                'cleanliness' => 'nullable|integer|min:1|max:5',
                'performance' => 'nullable|integer|min:1|max:5',
                'value_for_money' => 'nullable|integer|min:1|max:5',
            ]);

            $userId = $request->user()->id;

            $existingReview = Review::where('user_id', $userId)
                ->where('reservation_id', $data['reservation_id'])
                ->exists();

            if ($existingReview) {
                return response()->json(['error' => 'You have already reviewed this reservation.'], 422);
            }

            $reservation = \App\Models\Reservation::where('id', $data['reservation_id'])
                ->where('status', 'completed')
                ->first();

            if (! $reservation) {
                return response()->json(['error' => 'You can only review after completing a reservation.'], 422);
            }

            $data['user_id'] = $userId;
            $data['is_approved'] = false;
            $data['is_verified'] = true;

            $review = Review::create($data);

            try {
                $adminUser = \App\Models\User::where('role', 'admin')->first();
                if ($adminUser) {
                    $adminUser->notify(new \App\Notifications\ReviewSubmitted($review));
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Review notification failed', ['error' => $e->getMessage()]);
            }

            return response()->json($review, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create review.', 'message' => $e->getMessage()], 500);
        }
    }

    public function approve(Review $review)
    {
        try {
            $review->update(['is_approved' => true]);

            return response()->json([
                'message' => 'Review approved successfully.',
                'review' => $review,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to approve review.', 'message' => $e->getMessage()], 500);
        }
    }

    public function vehicleStats(Request $request)
    {
        try {
            $vehicleId = $request->route('vehicleId') ?? $request->get('vehicle_id');

            if (! $vehicleId) {
                return response()->json(['error' => 'vehicle_id is required.'], 422);
            }

            $reviews = Review::where('vehicle_id', $vehicleId)
                ->where('is_approved', true);

            $totalReviews = $reviews->count();
            $averageRating = (clone $reviews)->avg('rating');

            $breakdown = [
                'cleanliness' => (clone $reviews)->avg('cleanliness'),
                'performance' => (clone $reviews)->avg('performance'),
                'value_for_money' => (clone $reviews)->avg('value_for_money'),
            ];

            $ratingDistribution = [];
            for ($i = 1; $i <= 5; $i++) {
                $ratingDistribution[$i] = (clone $reviews)->where('rating', $i)->count();
            }

            return response()->json([
                'vehicle_id' => $vehicleId,
                'average_rating' => $averageRating ? round($averageRating, 2) : 0,
                'total_reviews' => $totalReviews,
                'category_breakdown' => $breakdown,
                'rating_distribution' => $ratingDistribution,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch vehicle stats.', 'message' => $e->getMessage()], 500);
        }
    }
}
