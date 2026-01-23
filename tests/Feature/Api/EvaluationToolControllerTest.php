<?php

namespace Tests\Feature\Api;

use App\Models\EvaluationTool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluationToolControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_evaluation_tools(): void
    {
        EvaluationTool::factory()->count(5)->create();

        $response = $this->getJson('/api/evaluation-tools');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_evaluation_tools_are_ordered_by_created_at_descending(): void
    {
        $oldTool = EvaluationTool::factory()->create(['created_at' => now()->subDays(5)]);
        $newTool = EvaluationTool::factory()->create(['created_at' => now()]);

        $response = $this->getJson('/api/evaluation-tools');

        $response->assertStatus(200);
        $tools = $response->json();
        $this->assertEquals($newTool->id, $tools[0]['id']);
    }

    public function test_can_create_evaluation_tool_with_dimensions(): void
    {
        $dimensions = ['Clarity', 'Engagement', 'Management'];

        $toolData = [
            'name' => 'Test Tool',
            'description' => 'A test evaluation tool',
            'dimensions' => $dimensions,
        ];

        $response = $this->postJson('/api/evaluation-tools', $toolData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Tool']);

        $this->assertDatabaseHas('evaluation_tools', [
            'name' => 'Test Tool',
        ]);

        $tool = EvaluationTool::where('name', 'Test Tool')->first();
        $this->assertEquals($dimensions, $tool->dimensions);
    }

    public function test_creating_evaluation_tool_requires_name(): void
    {
        $toolData = [
            'description' => 'A test tool',
        ];

        $response = $this->postJson('/api/evaluation-tools', $toolData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_create_evaluation_tool_without_description(): void
    {
        $toolData = [
            'name' => 'Test Tool',
            'dimensions' => ['Test Dimension'],
        ];

        $response = $this->postJson('/api/evaluation-tools', $toolData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Tool']);
    }

    public function test_can_show_single_evaluation_tool(): void
    {
        $tool = EvaluationTool::factory()->create();

        $response = $this->getJson("/api/evaluation-tools/{$tool->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $tool->id])
            ->assertJsonFragment(['name' => $tool->name]);
    }

    public function test_can_update_evaluation_tool(): void
    {
        $tool = EvaluationTool::factory()->create();

        $updateData = [
            'name' => 'Updated Tool Name',
        ];

        $response = $this->putJson("/api/evaluation-tools/{$tool->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated Tool Name']);

        $this->assertDatabaseHas('evaluation_tools', [
            'id' => $tool->id,
            'name' => 'Updated Tool Name',
        ]);
    }

    public function test_can_update_evaluation_tool_dimensions(): void
    {
        $tool = EvaluationTool::factory()->create();

        $newDimensions = ['New Dimension 1', 'New Dimension 2'];

        $response = $this->putJson("/api/evaluation-tools/{$tool->id}", [
            'dimensions' => $newDimensions,
        ]);

        $response->assertStatus(200);

        $tool->refresh();
        $this->assertEquals($newDimensions, $tool->dimensions);
    }

    public function test_can_delete_evaluation_tool(): void
    {
        $tool = EvaluationTool::factory()->create();

        $response = $this->deleteJson("/api/evaluation-tools/{$tool->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('evaluation_tools', ['id' => $tool->id]);
    }
}
