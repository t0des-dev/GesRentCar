<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = Page::published()->orderBy('sort_order')->get(['id', 'slug', 'title', 'meta', 'template', 'updated_at']);
        return response()->json($pages);
    }

    public function show(string $slug): JsonResponse
    {
        $page = Page::published()->where('slug', $slug)->firstOrFail();
        return response()->json($page);
    }

    public function adminIndex(): JsonResponse
    {
        $pages = Page::orderBy('sort_order')->get();
        return response()->json($pages);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'nullable|array',
            'template' => 'nullable|string|in:default,full-width,landing',
            'status' => 'nullable|in:draft,published',
            'sort_order' => 'nullable|integer',
            'meta' => 'nullable|array',
        ]);

        $page = Page::create($validated);
        return response()->json($page, 201);
    }

    public function update(Request $request, Page $page): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'nullable|array',
            'template' => 'nullable|string|in:default,full-width,landing',
            'status' => 'nullable|in:draft,published',
            'sort_order' => 'nullable|integer',
            'meta' => 'nullable|array',
        ]);

        $page->update($validated);
        return response()->json($page);
    }

    public function destroy(Page $page): JsonResponse
    {
        $page->delete();
        return response()->json(['message' => 'Page supprimée']);
    }
}
