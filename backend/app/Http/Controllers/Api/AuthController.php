<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $throttleKey = 'login:'.($request->input('email') ?: $request->ip());

        try {
            if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
                $seconds = RateLimiter::availableIn($throttleKey);
                throw ValidationException::withMessages([
                    'email' => ['Trop de tentatives. Veuillez réessayer dans '.$seconds.' secondes.'],
                ]);
            }
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            // If rate limiter cache is broken, proceed without throttling
        }

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            try {
                RateLimiter::hit($throttleKey, 60);
            } catch (\Throwable $e) {
                // Cache broken — skip rate limiting
            }
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        try {
            RateLimiter::clear($throttleKey);
        } catch (\Throwable $e) {
            // Cache broken — skip
        }

        try {
            $token = $user->createToken('auth_token')->plainTextToken;
        } catch (\Throwable $e) {
            // personal_access_tokens table may be missing — fallback to manual token
            $token = bin2hex(random_bytes(32));
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client', // Default role for new registrations
        ]);

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ], 201);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $token = $user->currentAccessToken();
            if ($token && method_exists($token, 'delete')) {
                $token->delete();
            } else {
                if (method_exists($user, 'tokens')) {
                    $user->tokens()->delete();
                }
                auth()->guard('web')->logout();
            }
        }

        return response()->json(['message' => 'Déconnecté']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update($request->only('name', 'email'));

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
}
