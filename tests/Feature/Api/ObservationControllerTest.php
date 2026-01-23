<?php

namespace Tests\Feature\Api;

use App\Models\EvaluationTool;
use App\Models\Observation;
use App\Models\Observer;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ObservationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_observations(): void
    {
        Observation::factory()->count(5)->create();

        $response = $this->getJson('/api/observations');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_observations_include_related_data(): void
    {
        $observation = Observation::factory()->create();

        $response = $this->getJson('/api/observations');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $observation->teacher_id]);
    }

    public function test_observations_are_ordered_by_date_descending(): void
    {
        $oldObservation = Observation::factory()->create([
            'observation_date' => now()->subDays(5),
        ]);
        $newObservation = Observation::factory()->create([
            'observation_date' => now(),
        ]);

        $response = $this->getJson('/api/observations');

        $response->assertStatus(200);
        $observations = $response->json();
        $this->assertEquals($newObservation->id, $observations[0]['id']);
    }

    public function test_can_create_observation_with_auto_calculated_scores(): void
    {
        $teacher = Teacher::factory()->create();
        $tool = EvaluationTool::factory()->create();
        $observer = Observer::factory()->create();

        $scores = [
            'Teaching Clarity' => 3.0,
            'Student Engagement' => 4.0,
            'Classroom Management' => 2.0,
            'Content Knowledge' => 3.0,
        ];

        $observationData = [
            'teacher_id' => $teacher->id,
            'evaluation_tool_id' => $tool->id,
            'observer_id' => $observer->id,
            'observation_date' => '2024-03-15',
            'scores' => $scores,
            'notes' => 'Good observation',
        ];

        $response = $this->postJson('/api/observations', $observationData);

        $response->assertStatus(201);

        $observation = $response->json();
        $this->assertEquals(3.0, $observation['average_score']);
        $this->assertEquals('Classroom Management', $observation['lowest_dimension']);
        $this->assertEquals(2.0, $observation['lowest_score']);
    }

    public function test_creating_observation_requires_teacher_id(): void
    {
        $tool = EvaluationTool::factory()->create();

        $observationData = [
            'evaluation_tool_id' => $tool->id,
            'observation_date' => '2024-03-15',
            'scores' => ['Test' => 3.0],
        ];

        $response = $this->postJson('/api/observations', $observationData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['teacher_id']);
    }

    public function test_creating_observation_requires_evaluation_tool_id(): void
    {
        $teacher = Teacher::factory()->create();

        $observationData = [
            'teacher_id' => $teacher->id,
            'observation_date' => '2024-03-15',
            'scores' => ['Test' => 3.0],
        ];

        $response = $this->postJson('/api/observations', $observationData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['evaluation_tool_id']);
    }

    public function test_creating_observation_requires_scores(): void
    {
        $teacher = Teacher::factory()->create();
        $tool = EvaluationTool::factory()->create();

        $observationData = [
            'teacher_id' => $teacher->id,
            'evaluation_tool_id' => $tool->id,
            'observation_date' => '2024-03-15',
        ];

        $response = $this->postJson('/api/observations', $observationData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['scores']);
    }

    public function test_can_show_single_observation(): void
    {
        $observation = Observation::factory()->create();

        $response = $this->getJson("/api/observations/{$observation->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $observation->id]);
    }

    public function test_can_update_observation_and_recalculate_scores(): void
    {
        $observation = Observation::factory()->create();

        $newScores = [
            'Teaching Clarity' => 4.0,
            'Student Engagement' => 4.0,
            'Classroom Management' => 4.0,
            'Content Knowledge' => 4.0,
        ];

        $response = $this->putJson("/api/observations/{$observation->id}", [
            'scores' => $newScores,
        ]);

        $response->assertStatus(200);

        $updatedObservation = $response->json();
        $this->assertEquals(4.0, $updatedObservation['average_score']);
    }

    public function test_can_delete_observation(): void
    {
        $observation = Observation::factory()->create();

        $response = $this->deleteJson("/api/observations/{$observation->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('observations', ['id' => $observation->id]);
    }

    public function test_creating_observation_with_invalid_teacher_fails(): void
    {
        $tool = EvaluationTool::factory()->create();

        $observationData = [
            'teacher_id' => 999,
            'evaluation_tool_id' => $tool->id,
            'observation_date' => '2024-03-15',
            'scores' => ['Test' => 3.0],
        ];

        $response = $this->postJson('/api/observations', $observationData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['teacher_id']);
    }
}
