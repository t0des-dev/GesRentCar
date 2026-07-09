<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientBlacklist;
use Illuminate\Http\Request;

class ClientBlacklistController extends Controller
{
    public function index()
    {
        try {
            $blacklist = ClientBlacklist::with('blockedBy')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($blacklist);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch blacklist.', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|email|unique:client_blacklists,email',
                'cin' => 'nullable|string|unique:client_blacklists,cin',
                'phone' => 'nullable|string',
                'reason' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            $data['blocked_by'] = $request->user()->id;

            $blacklist = ClientBlacklist::create($data);

            return response()->json($blacklist, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to blacklist client.', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(ClientBlacklist $clientBlacklist)
    {
        try {
            $clientBlacklist->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to remove from blacklist.', 'message' => $e->getMessage()], 500);
        }
    }

    public function check(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required_without:cin|email',
                'cin' => 'required_without:email|string',
            ]);

            $query = ClientBlacklist::query();

            if (isset($data['email'])) {
                $query->where('email', $data['email']);
            }

            if (isset($data['cin'])) {
                $query->orWhere('cin', $data['cin']);
            }

            $isBlacklisted = $query->exists();

            return response()->json([
                'blacklisted' => $isBlacklisted,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check blacklist status.', 'message' => $e->getMessage()], 500);
        }
    }
}
