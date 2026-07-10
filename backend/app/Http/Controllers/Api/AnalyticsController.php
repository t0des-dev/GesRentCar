<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends Controller
{
    private const CACHE_KEY_VIEWS = 'analytics:page_views';
    private const CACHE_KEY_VISITORS = 'analytics:unique_visitors';
    private const CACHE_TTL = 1440; // 24 hours

    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event' => 'required|string|max:100',
            'path' => 'required|string|max:255',
            'data' => 'nullable|array',
            'timestamp' => 'required|integer',
        ]);

        $event = $validated['event'];
        $path = $validated['path'];
        $data = $validated['data'] ?? [];
        $timestamp = $validated['timestamp'];

        $visitorId = $this->getVisitorId($request);

        // Increment page view count
        $views = Cache::get(self::CACHE_KEY_VIEWS, []);
        $views[$path] = ($views[$path] ?? 0) + 1;
        Cache::put(self::CACHE_KEY_VIEWS, $views, self::CACHE_TTL);

        // Track unique visitors per path
        $visitors = Cache::get(self::CACHE_KEY_VISITORS, []);
        $visitorKey = $path . ':' . $visitorId;
        if (!isset($visitors[$visitorKey])) {
            $visitors[$visitorKey] = $timestamp;
            Cache::put(self::CACHE_KEY_VISITORS, $visitors, self::CACHE_TTL);
        }

        return response()->json([
            'success' => true,
        ], 201);
    }

    public function stats(): JsonResponse
    {
        $views = Cache::get(self::CACHE_KEY_VIEWS, []);
        $visitors = Cache::get(self::CACHE_KEY_VISITORS, []);

        // Build unique visitor counts per path
        $uniqueVisitors = [];
        foreach ($visitors as $key => $value) {
            if (!str_contains($key, ':')) continue;
            [$path] = explode(':', $key, 2);
            $uniqueVisitors[$path] = ($uniqueVisitors[$path] ?? 0) + 1;
        }

        // Sort by view count descending
        arsort($views);

        // Build popular pages (top 10)
        $popularPages = [];
        $rank = 0;
        foreach ($views as $path => $count) {
            if ($rank >= 10) break;
            $popularPages[] = [
                'path' => $path,
                'total_views' => $count,
                'unique_visitors' => $uniqueVisitors[$path] ?? 0,
            ];
            $rank++;
        }

        $totalViews = array_sum($views);
        $uniquePaths = count($views);

        return response()->json([
            'total_views' => $totalViews,
            'unique_paths' => $uniquePaths,
            'popular_pages' => $popularPages,
        ]);
    }

    private function getVisitorId(Request $request): string
    {
        $fingerprint = $request->header('X-Visitor-Id')
            ?? $request->input('data.visitor_id')
            ?? $request->ip();

        return md5($fingerprint);
    }
}
