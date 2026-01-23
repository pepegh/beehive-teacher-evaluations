<?php

namespace Tests\Feature\Api;

use App\Models\EvaluationTool;
use App\Models\Observation;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_tool_analysis_requires_evaluation_tool_id(): void
    {
        $response = $this->getJson('/api/dashboard/tool-analysis');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['evaluation_tool_id']);
    }

    public function test_tool_analysis_returns_overall_stats(): void
    {
        $tool = EvaluationTool::factory()->create();
        Observation::factory()
            ->count(3)
            ->forEvaluationTool($tool)
            ->create();

        $response = $this->getJson("/api/dashboard/tool-analysis?evaluation_tool_id={$tool->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'overall_stats' => [
                    'total_observations',
                    'overall_average',
                    'highest_score',
                    'lowest_score',
                ],
            ]);

        $data = $response->json();
        $this->assertEquals(3, $data['overall_stats']['total_observations']);
    }

    public function test_tool_analysis_returns_dimension_analysis(): void
    {
        $tool = EvaluationTool::factory()->create();
        Observation::factory()
            ->forEvaluationTool($tool)
            ->withScores([
                'Clarity' => 4.0,
                'Engagement' => 3.0,
            ])
            ->create();

        $response = $this->getJson("/api/dashboard/tool-analysis?evaluation_tool_id={$tool->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'dimension_analysis' => [
                    'highest_dimension',
                    'lowest_dimension',
                    'all_dimensions',
                ],
            ]);
    }

    public function test_tool_analysis_returns_teacher_comparison(): void
    {
        $tool = EvaluationTool::factory()->create();
        $teacher1 = Teacher::factory()->create();
        $teacher2 = Teacher::factory()->create();

        Observation::factory()
            ->forEvaluationTool($tool)
            ->forTeacher($teacher1)
            ->create();
        Observation::factory()
            ->forEvaluationTool($tool)
            ->forTeacher($teacher2)
            ->create();

        $response = $this->getJson("/api/dashboard/tool-analysis?evaluation_tool_id={$tool->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['teacher_comparison']);

        $data = $response->json();
        $this->assertCount(2, $data['teacher_comparison']);
    }

    public function test_tool_analysis_respects_date_filters(): void
    {
        $tool = EvaluationTool::factory()->create();

        // Create observation in the past
        Observation::factory()
            ->forEvaluationTool($tool)
            ->create(['observation_date' => '2023-01-15']);

        // Create observation in the future
        Observation::factory()
            ->forEvaluationTool($tool)
            ->create(['observation_date' => '2024-06-15']);

        $response = $this->getJson("/api/dashboard/tool-analysis?evaluation_tool_id={$tool->id}&start_date=2024-01-01&end_date=2024-12-31");

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals(1, $data['overall_stats']['total_observations']);
    }

    public function test_teacher_performance_requires_teacher_id(): void
    {
        $response = $this->getJson('/api/dashboard/teacher-performance');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['teacher_id']);
    }

    public function test_teacher_performance_returns_dimension_analysis(): void
    {
        $teacher = Teacher::factory()->create();
        Observation::factory()
            ->forTeacher($teacher)
            ->withScores([
                'Clarity' => 4.0,
                'Engagement' => 3.0,
            ])
            ->create();

        $response = $this->getJson("/api/dashboard/teacher-performance?teacher_id={$teacher->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'dimension_analysis' => [
                    'highest_dimension',
                    'lowest_dimension',
                    'all_dimensions',
                ],
            ]);
    }

    public function test_teacher_performance_returns_scores_over_time(): void
    {
        $teacher = Teacher::factory()->create();
        Observation::factory()
            ->count(3)
            ->forTeacher($teacher)
            ->create();

        $response = $this->getJson("/api/dashboard/teacher-performance?teacher_id={$teacher->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['scores_over_time']);

        $data = $response->json();
        $this->assertCount(3, $data['scores_over_time']);
    }

    public function test_teacher_performance_calculates_trend(): void
    {
        $teacher = Teacher::factory()->create();

        // Create improving observations
        Observation::factory()
            ->forTeacher($teacher)
            ->withScores(['Clarity' => 2.0, 'Engagement' => 2.0])
            ->create(['observation_date' => '2024-01-01']);

        Observation::factory()
            ->forTeacher($teacher)
            ->withScores(['Clarity' => 4.0, 'Engagement' => 4.0])
            ->create(['observation_date' => '2024-06-01']);

        $response = $this->getJson("/api/dashboard/teacher-performance?teacher_id={$teacher->id}");

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals('improving', $data['overall_stats']['trend']);
    }

    public function test_teacher_performance_returns_tool_breakdown(): void
    {
        $teacher = Teacher::factory()->create();
        $tool1 = EvaluationTool::factory()->create();
        $tool2 = EvaluationTool::factory()->create();

        Observation::factory()
            ->forTeacher($teacher)
            ->forEvaluationTool($tool1)
            ->create();
        Observation::factory()
            ->forTeacher($teacher)
            ->forEvaluationTool($tool2)
            ->create();

        $response = $this->getJson("/api/dashboard/teacher-performance?teacher_id={$teacher->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['tool_breakdown']);

        $data = $response->json();
        $this->assertCount(2, $data['tool_breakdown']);
    }
}
