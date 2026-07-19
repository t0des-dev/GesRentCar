<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

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
            return $this->serverErrorResponse('Échec du chargement des avis.');
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
                return $this->errorResponse('Vous avez déjà avisé cette réservation.', 422, 'already_reviewed');
            }

            $reservation = \App\Models\Reservation::where('id', $data['reservation_id'])
                ->where('status', 'completed')
                ->first();

            if (! $reservation) {
                return $this->errorResponse('Vous ne pouvez avisé qu\'après avoir terminé une réservation.', 422, 'reservation_not_completed');
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
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Échec de la création de l\'avis.');
        }
    }

    public function approve(Review $review)
    {
        try {
            $review->update(['is_approved' => true]);

            return $this->successResponse([
                'review' => $review,
            ], 'Avis approuvé avec succès.');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Échec de l\'approbation de l\'avis.');
        }
    }

    public function vehicleStats(Request $request)
    {
        try {
            $vehicleId = $request->route('vehicleId') ?? $request->get('vehicle_id');

            if (! $vehicleId) {
                return $this->errorResponse('vehicle_id est requis.', 422, 'missing_vehicle_id');
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
            return $this->serverErrorResponse('Échec du chargement des statistiques.');
        }
    }
}
