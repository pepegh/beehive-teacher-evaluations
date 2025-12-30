<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Observation;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Dashboard 1: Evaluation Tool Analysis
     * Compare all teachers using a specific evaluation tool
     *
     * Query params:
     * - evaluation_tool_id (required)
     * - start_date (optional)
     * - end_date (optional)
     */
    public function toolAnalysis(Request $request): JsonResponse
    {
        $request->validate([
            'evaluation_tool_id' => 'required|exists:evaluation_tools,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $query = Observation::query()
            ->where('evaluation_tool_id', $request->evaluation_tool_id);

        // Apply date filters
        if ($request->has('start_date')) {
            $query->where('observation_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('observation_date', '<=', $request->end_date);
        }

        // Get all observations for this tool
        $observations = $query->with(['teacher', 'evaluationTool', 'observer'])->get();

        // Overall Statistics
        $totalObservations = $observations->count();
        $overallAverage = $observations->avg('average_score') ?? 0;
        $highestScore = $observations->max('average_score') ?? 0;
        $lowestScore = $observations->min('average_score') ?? 0;

        // Dimension Analysis (highest/lowest across all teachers)
        $dimensionScores = [];
        $dimensionCounts = [];

        foreach ($observations as $observation) {
            if (!is_array($observation->scores)) {
                continue;
            }

            foreach ($observation->scores as $dimension => $score) {
                if (!isset($dimensionScores[$dimension])) {
                    $dimensionScores[$dimension] = 0;
                    $dimensionCounts[$dimension] = 0;
                }
                $dimensionScores[$dimension] += $score;
                $dimensionCounts[$dimension]++;
            }
        }

        // Calculate average per dimension
        $dimensionAverages = [];
        foreach ($dimensionScores as $dimension => $totalScore) {
            $avg = $totalScore / $dimensionCounts[$dimension];
            $dimensionAverages[] = [
                'dimension' => $dimension,
                'average_score' => round($avg, 2),
                'count' => $dimensionCounts[$dimension],
            ];
        }

        // Sort to find highest and lowest
        usort($dimensionAverages, function ($a, $b) {
            return $b['average_score'] <=> $a['average_score'];
        });

        $highestDimension = $dimensionAverages[0] ?? null;
        $lowestDimension = end($dimensionAverages) ?: null;

        // Teacher Comparison Data (average score per teacher)
        $teacherScores = $observations->groupBy('teacher_id')->map(function ($teacherObservations) {
            $teacher = $teacherObservations->first()->teacher;
            return [
                'teacher_id' => $teacher->id,
                'teacher_name' => $teacher->first_name . ' ' . $teacher->last_name,
                'average_score' => round($teacherObservations->avg('average_score'), 2),
                'observations_count' => $teacherObservations->count(),
            ];
        })->values()->sortByDesc('average_score')->values();

        return response()->json([
            'evaluation_tool' => $observations->first()->evaluationTool ?? null,
            'period' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'overall_stats' => [
                'total_observations' => $totalObservations,
                'overall_average' => round($overallAverage, 2),
                'highest_score' => round($highestScore, 2),
                'lowest_score' => round($lowestScore, 2),
            ],
            'dimension_analysis' => [
                'highest_dimension' => $highestDimension,
                'lowest_dimension' => $lowestDimension,
                'all_dimensions' => $dimensionAverages,
            ],
            'teacher_comparison' => $teacherScores,
        ]);
    }

    /**
     * Dashboard 2: Teacher Performance Analysis
     * Track individual teacher performance over time
     *
     * Query params:
     * - teacher_id (required)
     * - start_date (optional)
     * - end_date (optional)
     * - evaluation_tool_id (optional) - if not provided, shows all tools
     */
    public function teacherPerformance(Request $request): JsonResponse
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'evaluation_tool_id' => 'nullable|exists:evaluation_tools,id',
        ]);

        $query = Observation::query()
            ->where('teacher_id', $request->teacher_id);

        // Apply date filters
        if ($request->has('start_date')) {
            $query->where('observation_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('observation_date', '<=', $request->end_date);
        }

        // Apply evaluation tool filter (optional)
        if ($request->has('evaluation_tool_id')) {
            $query->where('evaluation_tool_id', $request->evaluation_tool_id);
        }

        // Get all observations for this teacher
        $observations = $query->with(['teacher', 'evaluationTool', 'observer'])
            ->orderBy('observation_date', 'asc')
            ->get();

        // Get teacher info
        $teacher = Teacher::find($request->teacher_id);

        // Overall Statistics
        $totalObservations = $observations->count();
        $averageScore = $observations->avg('average_score') ?? 0;
        $highestScore = $observations->max('average_score') ?? 0;
        $lowestScore = $observations->min('average_score') ?? 0;

        // Score Over Time (for line chart)
        $scoresOverTime = $observations->map(function ($observation) {
            return [
                'date' => $observation->observation_date->format('Y-m-d'),
                'average_score' => round($observation->average_score, 2),
                'evaluation_tool' => $observation->evaluationTool->name ?? 'Unknown',
                'observation_id' => $observation->id,
            ];
        });

        // Dimension Analysis (highest/lowest for this teacher)
        $dimensionScores = [];
        $dimensionCounts = [];

        foreach ($observations as $observation) {
            if (!is_array($observation->scores)) {
                continue;
            }

            foreach ($observation->scores as $dimension => $score) {
                if (!isset($dimensionScores[$dimension])) {
                    $dimensionScores[$dimension] = 0;
                    $dimensionCounts[$dimension] = 0;
                }
                $dimensionScores[$dimension] += $score;
                $dimensionCounts[$dimension]++;
            }
        }

        // Calculate average per dimension
        $dimensionAverages = [];
        foreach ($dimensionScores as $dimension => $totalScore) {
            $avg = $totalScore / $dimensionCounts[$dimension];
            $dimensionAverages[] = [
                'dimension' => $dimension,
                'average_score' => round($avg, 2),
                'count' => $dimensionCounts[$dimension],
            ];
        }

        // Sort to find highest and lowest
        usort($dimensionAverages, function ($a, $b) {
            return $b['average_score'] <=> $a['average_score'];
        });

        $highestDimension = $dimensionAverages[0] ?? null;
        $lowestDimension = end($dimensionAverages) ?: null;

        // Breakdown by Evaluation Tool
        $toolBreakdown = $observations->groupBy('evaluation_tool_id')->map(function ($toolObservations) {
            $tool = $toolObservations->first()->evaluationTool;
            return [
                'tool_id' => $tool->id,
                'tool_name' => $tool->name,
                'average_score' => round($toolObservations->avg('average_score'), 2),
                'observations_count' => $toolObservations->count(),
            ];
        })->values();

        // Calculate trend (comparing first half vs second half)
        $trend = null;
        if ($totalObservations >= 2) {
            $midpoint = floor($totalObservations / 2);
            $firstHalf = $observations->take($midpoint);
            $secondHalf = $observations->skip($midpoint);

            $firstHalfAvg = $firstHalf->avg('average_score');
            $secondHalfAvg = $secondHalf->avg('average_score');

            $difference = $secondHalfAvg - $firstHalfAvg;

            if ($difference > 0.3) {
                $trend = 'improving';
            } elseif ($difference < -0.3) {
                $trend = 'declining';
            } else {
                $trend = 'stable';
            }
        }

        return response()->json([
            'teacher' => [
                'id' => $teacher->id,
                'name' => $teacher->first_name . ' ' . $teacher->last_name,
                'department' => $teacher->department,
                'level' => $teacher->level,
                'subject' => $teacher->subject,
            ],
            'period' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'filters' => [
                'evaluation_tool_id' => $request->evaluation_tool_id,
            ],
            'overall_stats' => [
                'total_observations' => $totalObservations,
                'average_score' => round($averageScore, 2),
                'highest_score' => round($highestScore, 2),
                'lowest_score' => round($lowestScore, 2),
                'trend' => $trend,
            ],
            'scores_over_time' => $scoresOverTime,
            'dimension_analysis' => [
                'highest_dimension' => $highestDimension,
                'lowest_dimension' => $lowestDimension,
                'all_dimensions' => $dimensionAverages,
            ],
            'tool_breakdown' => $toolBreakdown,
        ]);
    }
}
