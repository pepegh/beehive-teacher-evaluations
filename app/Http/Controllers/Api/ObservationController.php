<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Observation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ObservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $observations = Observation::with(['teacher', 'evaluationTool', 'observer'])
            ->orderBy('observation_date', 'desc')
            ->get();
        return response()->json($observations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'evaluation_tool_id' => 'required|exists:evaluation_tools,id',
            'observer_id' => 'nullable|exists:observers,id',
            'observation_date' => 'required|date',
            'scores' => 'required|array',
            'notes' => 'nullable|string',
        ]);

        // Calculate average score
        $scores = $validated['scores'];
        $validated['average_score'] = count($scores) > 0
            ? array_sum($scores) / count($scores)
            : 0;

        // Find lowest dimension and score
        if (count($scores) > 0) {
            $lowestScore = min($scores);
            $lowestDimension = array_search($lowestScore, $scores);
            $validated['lowest_score'] = $lowestScore;
            $validated['lowest_dimension'] = $lowestDimension;
        }

        $observation = Observation::create($validated);
        $observation->load(['teacher', 'evaluationTool', 'observer']);

        return response()->json($observation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Observation $observation): JsonResponse
    {
        $observation->load(['teacher', 'evaluationTool', 'observer']);
        return response()->json($observation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Observation $observation): JsonResponse
    {
        $validated = $request->validate([
            'teacher_id' => 'sometimes|required|exists:teachers,id',
            'evaluation_tool_id' => 'sometimes|required|exists:evaluation_tools,id',
            'observer_id' => 'nullable|exists:observers,id',
            'observation_date' => 'sometimes|required|date',
            'scores' => 'sometimes|required|array',
            'notes' => 'nullable|string',
        ]);

        // Calculate average score and lowest dimension/score if scores were updated
        if (isset($validated['scores'])) {
            $scores = $validated['scores'];
            $validated['average_score'] = count($scores) > 0
                ? array_sum($scores) / count($scores)
                : 0;

            // Find lowest dimension and score
            if (count($scores) > 0) {
                $lowestScore = min($scores);
                $lowestDimension = array_search($lowestScore, $scores);
                $validated['lowest_score'] = $lowestScore;
                $validated['lowest_dimension'] = $lowestDimension;
            }
        }

        $observation->update($validated);
        $observation->load(['teacher', 'evaluationTool', 'observer']);

        return response()->json($observation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Observation $observation): JsonResponse
    {
        $observation->delete();
        return response()->json(null, 204);
    }
}
