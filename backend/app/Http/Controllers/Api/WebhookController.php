<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Webhook;
use App\Models\WebhookLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WebhookController extends Controller
{
    public function index()
    {
        try {
            $webhooks = Webhook::orderBy('created_at', 'desc')->get();

            return response()->json($webhooks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch webhooks.', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'url' => 'required|url',
                'events' => 'required|array|min:1',
                'events.*' => 'string',
                'secret' => 'nullable|string|max:255',
                'is_active' => 'boolean',
            ]);

            if (! isset($data['is_active'])) {
                $data['is_active'] = true;
            }

            $data['retry_count'] = 0;
            $data['failure_count'] = 0;

            $webhook = Webhook::create($data);

            return response()->json($webhook, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create webhook.', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Webhook $webhook)
    {
        try {
            $data = $request->validate([
                'name' => 'sometimes|string|max:255',
                'url' => 'sometimes|url',
                'events' => 'sometimes|array|min:1',
                'events.*' => 'string',
                'secret' => 'nullable|string|max:255',
                'is_active' => 'boolean',
            ]);

            $webhook->update($data);

            return response()->json($webhook);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update webhook.', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Webhook $webhook)
    {
        try {
            $webhook->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete webhook.', 'message' => $e->getMessage()], 500);
        }
    }

    public function test(Webhook $webhook)
    {
        try {
            $payload = [
                'event' => 'webhook.test',
                'timestamp' => now()->toIso8601String(),
                'data' => [
                    'message' => 'This is a test webhook payload.',
                ],
            ];

            $response = Http::timeout(10)->withHeaders([
                'Content-Type' => 'application/json',
                'X-Webhook-Event' => 'webhook.test',
                'X-Webhook-Secret' => $webhook->secret ?? '',
            ])->post($webhook->url, $payload);

            $success = $response->successful();

            WebhookLog::create([
                'webhook_id' => $webhook->id,
                'event' => 'webhook.test',
                'payload' => $payload,
                'status_code' => $response->status(),
                'response_body' => $response->body(),
                'success' => $success,
            ]);

            $webhook->update(['last_triggered_at' => now()]);

            if (! $success) {
                $webhook->increment('failure_count');
            }

            return response()->json([
                'success' => $success,
                'status_code' => $response->status(),
                'response' => $response->body(),
            ]);
        } catch (\Exception $e) {
            WebhookLog::create([
                'webhook_id' => $webhook->id,
                'event' => 'webhook.test',
                'payload' => [],
                'status_code' => 0,
                'response_body' => $e->getMessage(),
                'success' => false,
            ]);

            $webhook->increment('failure_count');

            return response()->json(['error' => 'Failed to send test payload.', 'message' => $e->getMessage()], 500);
        }
    }

    public function dispatch(string $event, array $payload)
    {
        $webhooks = Webhook::where('is_active', true)
            ->whereJsonContains('events', $event)
            ->get();

        foreach ($webhooks as $webhook) {
            try {
                $response = Http::timeout(10)->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Webhook-Event' => $event,
                    'X-Webhook-Secret' => $webhook->secret ?? '',
                ])->post($webhook->url, [
                    'event' => $event,
                    'timestamp' => now()->toIso8601String(),
                    'data' => $payload,
                ]);

                $success = $response->successful();

                WebhookLog::create([
                    'webhook_id' => $webhook->id,
                    'event' => $event,
                    'payload' => $payload,
                    'status_code' => $response->status(),
                    'response_body' => $response->body(),
                    'success' => $success,
                ]);

                $webhook->update(['last_triggered_at' => now()]);

                if (! $success) {
                    $webhook->increment('failure_count');
                } else {
                    $webhook->update(['failure_count' => 0]);
                }
            } catch (\Exception $e) {
                WebhookLog::create([
                    'webhook_id' => $webhook->id,
                    'event' => $event,
                    'payload' => $payload,
                    'status_code' => 0,
                    'response_body' => $e->getMessage(),
                    'success' => false,
                ]);

                $webhook->increment('failure_count');
            }
        }
    }
}
