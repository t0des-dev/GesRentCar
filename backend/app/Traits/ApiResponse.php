<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function successResponse($data = null, string $message = 'OK', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function errorResponse(string $message = 'Erreur', int $code = 400, ?string $error = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($error) {
            $payload['error'] = $error;
        }

        return response()->json($payload, $code);
    }

    protected function validationErrorResponse($errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $errors,
        ], 422);
    }

    protected function notFoundResponse(string $message = 'Ressource introuvable'): JsonResponse
    {
        return $this->errorResponse($message, 404, 'not_found');
    }

    protected function unauthorizedResponse(string $message = 'Non autorisé'): JsonResponse
    {
        return $this->errorResponse($message, 401, 'unauthorized');
    }

    protected function forbiddenResponse(string $message = 'Accès interdit'): JsonResponse
    {
        return $this->errorResponse($message, 403, 'forbidden');
    }

    protected function serverErrorResponse(string $message = 'Erreur serveur'): JsonResponse
    {
        return $this->errorResponse($message, 500, 'server_error');
    }
}
