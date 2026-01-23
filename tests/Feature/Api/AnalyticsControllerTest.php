<?php

namespace Tests\Feature\Api;

use App\Models\EvaluationTool;
use App\Models\Observation;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_dimension_weakness_returns_empty_array_when_no_observations(): void
    {
        $response = $this->getJson('/api/analytics/dimension-weakness');

        $response->assertStatus(200)
            ->assertJson([]);
    }

    public function test_dimension_weakness_identifies_weak_performers_below_3(): void
    {
        $tool = EvaluationTool::factory()->create();
        $weakTeacher = Teacher::factory()->create(['first_name' => 'Weak', 'middle_name' => null, 'last_name' => 'Teacher']);

        Observation::factory()
            ->forTeacher($weakTeacher)
            ->forEvaluationTool($tool)
            ->withScores([
                'Clarity' => 2.5,
                'Engagement' => 2.0,
            ])
            ->create();

        $response = $this->getJson('/api/analytics/dimension-weakness');

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertNotEmpty($data);

        $clarityDimension = collect($data)->firstWhere('dimension', 'Clarity');
        $this->assertNotNull($clarityDimension);
        $this->assertGreaterThan(0, $clarityDimension['weakCount']);
        $this->assertContains('Weak Teacher', array_column($clarityDimension['weakTeachers'], 'name'));
    }

    public function test_dimension_weakness_identifies_strong_performers_above_3_5(): void
    {
        $tool = EvaluationTool::factory()->create();
        $strongTeacher = Teacher::factory()->create([
            'first_name' => 'Strong',
            'middle_name' => null,
            'last_name' => 'Teacher',
        ]);

        Observation::factory()
            ->forTeacher($strongTeacher)
            ->forEvaluationTool($tool)
            ->withScores([
                'Clarity' => 3.8,
                'Engagement' => 3.9,
            ])
            ->create();

        $response = $this->getJson('/api/analytics/dimension-weakness');

        $response->assertStatus(200);

        $data = $response->json();
        $clarityDimension = collect($data)->firstWhere('dimension', 'Clarity');
        $this->assertNotNull($clarityDimension);
        $this->assertGreaterThan(0, $clarityDimension['strongCount']);
        $this->assertContains('Strong Teacher', array_column($clarityDimension['strongTeachers'], 'name'));
    }

    public function test_dimension_weakness_weak_teachers_are_sorted_by_score_ascending(): void
    {
        $tool = EvaluationTool::factory()->create();

        $teacher1 = Teacher::factory()->create(['first_name' => 'Very', 'middle_name' => null, 'last_name' => 'Weak']);
        $teacher2 = Teacher::factory()->create(['first_name' => 'Somewhat', 'middle_name' => null, 'last_name' => 'Weak']);

        Observation::factory()
            ->forTeacher($teacher1)
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 1.5])
            ->create();

        Observation::factory()
            ->forTeacher($teacher2)
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 2.5])
            ->create();

        $response = $this->getJson('/api/analytics/dimension-weakness');

        $response->assertStatus(200);

        $data = $response->json();
        $clarityDimension = collect($data)->firstWhere('dimension', 'Clarity');
        $weakTeachers = $clarityDimension['weakTeachers'];

        $this->assertEquals('Very Weak', $weakTeachers[0]['name']);
        $this->assertEquals('Somewhat Weak', $weakTeachers[1]['name']);
    }

    public function test_dimension_weakness_strong_teachers_are_sorted_by_score_descending(): void
    {
        $tool = EvaluationTool::factory()->create();

        $teacher1 = Teacher::factory()->create(['first_name' => 'Very', 'middle_name' => null, 'last_name' => 'Strong']);
        $teacher2 = Teacher::factory()->create(['first_name' => 'Somewhat', 'middle_name' => null, 'last_name' => 'Strong']);

        Observation::factory()
            ->forTeacher($teacher1)
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 4.0])
            ->create();

        Observation::factory()
            ->forTeacher($teacher2)
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 3.6])
            ->create();

        $response = $this->getJson('/api/analytics/dimension-weakness');

        $response->assertStatus(200);

        $data = $response->json();
        $clarityDimension = collect($data)->firstWhere('dimension', 'Clarity');
        $strongTeachers = $clarityDimension['strongTeachers'];

        $this->assertEquals('Very Strong', $strongTeachers[0]['name']);
        $this->assertEquals('Somewhat Strong', $strongTeachers[1]['name']);
    }

    public function test_dimension_weakness_respects_evaluation_tool_filter(): void
    {
        $tool1 = EvaluationTool::factory()->create(['name' => 'Tool 1']);
        $tool2 = EvaluationTool::factory()->create(['name' => 'Tool 2']);

        Observation::factory()
            ->forEvaluationTool($tool1)
            ->withScores(['Clarity' => 2.5])
            ->create();

        Observation::factory()
            ->forEvaluationTool($tool2)
            ->withScores(['Management' => 2.5])
            ->create();

        $response = $this->getJson("/api/analytics/dimension-weakness?evaluation_tool_id={$tool1->id}");

        $response->assertStatus(200);

        $data = $response->json();
        $dimensions = array_column($data, 'dimension');

        $this->assertContains('Clarity', $dimensions);
        $this->assertNotContains('Management', $dimensions);
    }

    public function test_dimension_weakness_respects_date_filters(): void
    {
        $tool = EvaluationTool::factory()->create();

        Observation::factory()
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 2.5])
            ->create(['observation_date' => '2023-01-15']);

        Observation::factory()
            ->forEvaluationTool($tool)
            ->withScores(['Management' => 2.5])
            ->create(['observation_date' => '2024-06-15']);

        $response = $this->getJson('/api/analytics/dimension-weakness?start_date=2024-01-01&end_date=2024-12-31');

        $response->assertStatus(200);

        $data = $response->json();
        $dimensions = array_column($data, 'dimension');

        $this->assertContains('Management', $dimensions);
        $this->assertNotContains('Clarity', $dimensions);
    }

    public function test_dimension_weakness_calculates_correct_average(): void
    {
        $tool = EvaluationTool::factory()->create();

        Observation::factory()
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 3.0])
            ->create();

        Observation::factory()
            ->forEvaluationTool($tool)
            ->withScores(['Clarity' => 4.0])
            ->create();

        $response = $this->getJson('/api/analytics/dimension-weakness');

        $response->assertStatus(200);

        $data = $response->json();
        $clarityDimension = collect($data)->firstWhere('dimension', 'Clarity');

        $this->assertEquals(3.5, $clarityDimension['averageScore']);
    }
}
