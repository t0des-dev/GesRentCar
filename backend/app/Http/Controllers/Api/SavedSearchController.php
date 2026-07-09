<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedSearch;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class SavedSearchController extends Controller
{
    public function index(Request $request)
    {
        try {
            $searches = SavedSearch::where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($searches);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch saved searches.', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'filters' => 'required|array',
                'notify_new_results' => 'boolean',
            ]);

            $data['user_id'] = $request->user()->id;
            $data['last_checked_at'] = now();

            $savedSearch = SavedSearch::create($data);

            return response()->json($savedSearch, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save search.', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(SavedSearch $savedSearch)
    {
        try {
            if ($savedSearch->user_id !== request()->user()->id) {
                return response()->json(['error' => 'Unauthorized.'], 403);
            }

            $savedSearch->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete saved search.', 'message' => $e->getMessage()], 500);
        }
    }

    public function checkNewResults(Request $request)
    {
        try {
            $searches = SavedSearch::where('user_id', $request->user()->id)
                ->where('notify_new_results', true)
                ->get();

            $results = [];

            foreach ($searches as $search) {
                $filters = $search->filters;
                $query = Vehicle::query();

                if (isset($filters['brand'])) {
                    $query->where('brand', $filters['brand']);
                }
                if (isset($filters['model'])) {
                    $query->where('model', $filters['model']);
                }
                if (isset($filters['category'])) {
                    $query->where('category', $filters['category']);
                }
                if (isset($filters['min_price'])) {
                    $query->where('price_per_day', '>=', $filters['min_price']);
                }
                if (isset($filters['max_price'])) {
                    $query->where('price_per_day', '<=', $filters['max_price']);
                }
                if (isset($filters['transmission'])) {
                    $query->where('transmission', $filters['transmission']);
                }
                if (isset($filters['fuel_type'])) {
                    $query->where('fuel_type', $filters['fuel_type']);
                }

                $newCount = $query->where('created_at', '>', $search->last_checked_at)->count();

                $results[] = [
                    'saved_search_id' => $search->id,
                    'name' => $search->name,
                    'new_results' => $newCount,
                ];

                $search->update(['last_checked_at' => now()]);
            }

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check new results.', 'message' => $e->getMessage()], 500);
        }
    }
}
