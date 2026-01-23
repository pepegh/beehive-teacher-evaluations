<?php

namespace Tests\Unit\Models;

use App\Models\EvaluationTool;
use App\Models\Observation;
use App\Models\Observer;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ObservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_observation_belongs_to_teacher(): void
    {
        $teacher = Teacher::factory()->create();
        $observation = Observation::factory()->forTeacher($teacher)->create();

        $this->assertInstanceOf(Teacher::class, $observation->teacher);
        $this->assertEquals($teacher->id, $observation->teacher->id);
    }

    public function test_observation_belongs_to_evaluation_tool(): void
    {
        $evaluationTool = EvaluationTool::factory()->create();
        $observation = Observation::factory()->forEvaluationTool($evaluationTool)->create();

        $this->assertInstanceOf(EvaluationTool::class, $observation->evaluationTool);
        $this->assertEquals($evaluationTool->id, $observation->evaluationTool->id);
    }

    public function test_observation_belongs_to_observer(): void
    {
        $observer = Observer::factory()->create();
        $observation = Observation::factory()->forObserver($observer)->create();

        $this->assertInstanceOf(Observer::class, $observation->observer);
        $this->assertEquals($observer->id, $observation->observer->id);
    }

    public function test_observation_scores_is_cast_to_array(): void
    {
        $scores = [
            'Teaching Clarity' => 3.5,
            'Student Engagement' => 4.0,
        ];

        $observation = Observation::factory()->withScores($scores)->create();

        $this->assertIsArray($observation->scores);
        $this->assertEquals($scores, $observation->scores);
    }

    public function test_observation_date_is_cast_to_date(): void
    {
        $observation = Observation::factory()->create([
            'observation_date' => '2024-03-15',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $observation->observation_date);
        $this->assertEquals('2024-03-15', $observation->observation_date->format('Y-m-d'));
    }

    public function test_observation_average_score_is_cast_to_float(): void
    {
        $observation = Observation::factory()->create([
            'average_score' => 3.75,
        ]);

        $this->assertIsFloat($observation->average_score);
        $this->assertEquals(3.75, $observation->average_score);
    }

    public function test_observation_lowest_score_is_cast_to_float(): void
    {
        $observation = Observation::factory()->create([
            'lowest_score' => 2.5,
        ]);

        $this->assertIsFloat($observation->lowest_score);
        $this->assertEquals(2.5, $observation->lowest_score);
    }

    public function test_observation_factory_creates_valid_observation(): void
    {
        $observation = Observation::factory()->create();

        $this->assertDatabaseHas('observations', [
            'id' => $observation->id,
        ]);
        $this->assertNotNull($observation->teacher_id);
        $this->assertNotNull($observation->evaluation_tool_id);
        $this->assertNotNull($observation->scores);
    }

    public function test_high_performing_observation_has_scores_above_3_5(): void
    {
        $observation = Observation::factory()->highPerforming()->create();

        $this->assertGreaterThanOrEqual(3.5, $observation->average_score);
    }

    public function test_low_performing_observation_has_scores_below_3_0(): void
    {
        $observation = Observation::factory()->lowPerforming()->create();

        $this->assertLessThan(3.0, $observation->average_score);
    }
}
