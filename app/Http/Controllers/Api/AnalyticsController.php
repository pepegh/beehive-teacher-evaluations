<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Observation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get dimension weakness analysis
     */
    public function dimensionWeakness(Request $request): JsonResponse
    {
        $query = Observation::with(['teacher', 'evaluationTool']);

        // Apply date filters
        if ($request->has('start_date')) {
            $query->where('observation_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('observation_date', '<=', $request->end_date);
        }

        // Apply evaluation tool filter
        if ($request->has('evaluation_tool_id')) {
            $query->where('evaluation_tool_id', $request->evaluation_tool_id);
        }

        $observations = $query->get();

        if ($observations->isEmpty()) {
            return response()->json([]);
        }

        // Collect all dimensions and their scores, preserving order
        $dimensionScores = [];
        $dimensionTeacherScores = [];
        $dimensionOrder = []; // Track the order dimensions first appear

        foreach ($observations as $observation) {
            if (!$observation->scores) {
                continue;
            }

            foreach ($observation->scores as $dimension => $score) {
                // Track dimension order (first occurrence)
                if (!isset($dimensionScores[$dimension])) {
                    $dimensionScores[$dimension] = [];
                    $dimensionTeacherScores[$dimension] = [];
                    $dimensionOrder[] = $dimension; // Preserve order
                }

                $dimensionScores[$dimension][] = $score;

                // Track individual teacher scores for this dimension
                $teacherName = $observation->teacher ? $observation->teacher->full_name : 'Unknown';
                if (!isset($dimensionTeacherScores[$dimension][$teacherName])) {
                    $dimensionTeacherScores[$dimension][$teacherName] = [];
                }
                $dimensionTeacherScores[$dimension][$teacherName][] = $score;
            }
        }

        // Calculate averages and find weak performers (below 3.0) and strong performers (3.5-4.0)
        // Process dimensions in the order they were first encountered
        $result = [];
        $weakThreshold = 3.0;
        $strongLowerThreshold = 3.5;
        $strongUpperThreshold = 4.0;

        foreach ($dimensionOrder as $dimension) {
            $scores = $dimensionScores[$dimension];
            $averageScore = array_sum($scores) / count($scores);

            // Calculate average score per teacher for this dimension
            $teacherAverages = [];
            foreach ($dimensionTeacherScores[$dimension] as $teacherName => $teacherScores) {
                $teacherAverage = array_sum($teacherScores) / count($teacherScores);
                $teacherAverages[$teacherName] = $teacherAverage;
            }

            // Find teachers below 3.0 threshold
            $weakTeachers = [];
            foreach ($teacherAverages as $teacherName => $teacherAverage) {
                if ($teacherAverage < $weakThreshold) {
                    $weakTeachers[] = [
                        'name' => $teacherName,
                        'score' => round($teacherAverage, 2),
                    ];
                }
            }

            // Sort weak teachers by score (lowest first)
            usort($weakTeachers, function($a, $b) {
                return $a['score'] <=> $b['score'];
            });

            // Find teachers between 3.5 and 4.0 (strong performers)
            $strongTeachers = [];
            foreach ($teacherAverages as $teacherName => $teacherAverage) {
                if ($teacherAverage >= $strongLowerThreshold && $teacherAverage <= $strongUpperThreshold) {
                    $strongTeachers[] = [
                        'name' => $teacherName,
                        'score' => round($teacherAverage, 2),
                    ];
                }
            }

            // Sort strong teachers by score (highest first)
            usort($strongTeachers, function($a, $b) {
                return $b['score'] <=> $a['score'];
            });

            $result[] = [
                'dimension' => $dimension,
                'averageScore' => round($averageScore, 2),
                'weakCount' => count($weakTeachers),
                'weakTeachers' => $weakTeachers,
                'strongCount' => count($strongTeachers),
                'strongTeachers' => $strongTeachers,
            ];
        }

        // Return in the original dimension order (no sorting)
        return response()->json($result);
    }
}
