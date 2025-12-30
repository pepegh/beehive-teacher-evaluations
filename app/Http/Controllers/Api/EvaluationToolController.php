<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvaluationTool;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EvaluationToolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $tools = EvaluationTool::orderBy('created_at', 'desc')->get();
        return response()->json($tools);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dimensions' => 'nullable|array',
        ]);

        $tool = EvaluationTool::create($validated);
        return response()->json($tool, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EvaluationTool $evaluationTool): JsonResponse
    {
        return response()->json($evaluationTool);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EvaluationTool $evaluationTool): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'dimensions' => 'nullable|array',
        ]);

        $evaluationTool->update($validated);
        return response()->json($evaluationTool);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EvaluationTool $evaluationTool): JsonResponse
    {
        $evaluationTool->delete();
        return response()->json(null, 204);
    }
}
