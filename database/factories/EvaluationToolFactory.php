<?php

namespace Database\Factories;

use App\Models\EvaluationTool;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EvaluationTool>
 */
class EvaluationToolFactory extends Factory
{
    protected $model = EvaluationTool::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true) . ' Assessment',
            'description' => fake()->paragraph(),
            'dimensions' => [
                'Teaching Clarity',
                'Student Engagement',
                'Classroom Management',
                'Content Knowledge',
            ],
        ];
    }

    /**
     * Create an evaluation tool with custom dimensions.
     */
    public function withDimensions(array $dimensions): static
    {
        return $this->state(fn (array $attributes) => [
            'dimensions' => $dimensions,
        ]);
    }

    /**
     * Create an ELEOT-style evaluation tool.
     */
    public function eleot(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'ELEOT Observation',
            'description' => 'Effective Learning Environments Observation Tool',
            'dimensions' => [
                'Equitable Learning',
                'High Expectations',
                'Supportive Learning',
                'Active Learning',
                'Progress Monitoring',
                'Well-Managed Learning',
                'Digital Learning',
            ],
        ]);
    }
}
