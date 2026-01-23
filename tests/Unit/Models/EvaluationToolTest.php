<?php

namespace Tests\Unit\Models;

use App\Models\EvaluationTool;
use App\Models\Observation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluationToolTest extends TestCase
{
    use RefreshDatabase;

    public function test_evaluation_tool_dimensions_is_cast_to_array(): void
    {
        $dimensions = ['Clarity', 'Engagement', 'Management'];

        $tool = EvaluationTool::factory()->withDimensions($dimensions)->create();

        $this->assertIsArray($tool->dimensions);
        $this->assertEquals($dimensions, $tool->dimensions);
    }

    public function test_evaluation_tool_has_many_observations(): void
    {
        $tool = EvaluationTool::factory()->create();
        Observation::factory()->count(3)->forEvaluationTool($tool)->create();

        $this->assertCount(3, $tool->observations);
        $this->assertInstanceOf(Observation::class, $tool->observations->first());
    }

    public function test_evaluation_tool_factory_creates_valid_tool(): void
    {
        $tool = EvaluationTool::factory()->create();

        $this->assertDatabaseHas('evaluation_tools', [
            'id' => $tool->id,
            'name' => $tool->name,
        ]);
        $this->assertNotNull($tool->dimensions);
    }

    public function test_evaluation_tool_eleot_factory_creates_correct_dimensions(): void
    {
        $tool = EvaluationTool::factory()->eleot()->create();

        $this->assertEquals('ELEOT Observation', $tool->name);
        $this->assertContains('Equitable Learning', $tool->dimensions);
        $this->assertContains('High Expectations', $tool->dimensions);
        $this->assertCount(7, $tool->dimensions);
    }

    public function test_evaluation_tool_fillable_attributes_can_be_mass_assigned(): void
    {
        $dimensions = ['Test Dimension 1', 'Test Dimension 2'];

        $tool = EvaluationTool::create([
            'name' => 'Test Tool',
            'description' => 'A test evaluation tool',
            'dimensions' => $dimensions,
        ]);

        $this->assertEquals('Test Tool', $tool->name);
        $this->assertEquals('A test evaluation tool', $tool->description);
        $this->assertEquals($dimensions, $tool->dimensions);
    }

    public function test_evaluation_tool_can_have_null_description(): void
    {
        $tool = EvaluationTool::factory()->create([
            'description' => null,
        ]);

        $this->assertNull($tool->description);
    }
}
