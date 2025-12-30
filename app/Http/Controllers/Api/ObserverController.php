<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Observer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ObserverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $observers = Observer::orderBy('name', 'asc')->get();
        return response()->json($observers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|in:english,spanish',
        ]);

        $observer = Observer::create($validated);
        return response()->json($observer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Observer $observer): JsonResponse
    {
        return response()->json($observer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Observer $observer): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'department' => 'sometimes|required|string|in:english,spanish',
        ]);

        $observer->update($validated);
        return response()->json($observer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Observer $observer): JsonResponse
    {
        $observer->delete();
        return response()->json(null, 204);
    }
}
