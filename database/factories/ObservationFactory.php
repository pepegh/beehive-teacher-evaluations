<?php

namespace Database\Factories;

use App\Models\EvaluationTool;
use App\Models\Observation;
use App\Models\Observer;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Observation>
 */
class ObservationFactory extends Factory
{
    protected $model = Observation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $scores = [
            'Teaching Clarity' => fake()->randomFloat(1, 1, 4),
            'Student Engagement' => fake()->randomFloat(1, 1, 4),
            'Classroom Management' => fake()->randomFloat(1, 1, 4),
            'Content Knowledge' => fake()->randomFloat(1, 1, 4),
        ];

        $averageScore = array_sum($scores) / count($scores);
        $lowestScore = min($scores);
        $lowestDimension = array_search($lowestScore, $scores);

        return [
            'teacher_id' => Teacher::factory(),
            'evaluation_tool_id' => EvaluationTool::factory(),
            'observer_id' => Observer::factory(),
            'observation_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'scores' => $scores,
            'notes' => fake()->optional(0.7)->paragraph(),
            'average_score' => $averageScore,
            'lowest_dimension' => $lowestDimension,
            'lowest_score' => $lowestScore,
        ];
    }

    /**
     * Create an observation with specific scores.
     */
    public function withScores(array $scores): static
    {
        $averageScore = count($scores) > 0 ? array_sum($scores) / count($scores) : 0;
        $lowestScore = count($scores) > 0 ? min($scores) : 0;
        $lowestDimension = count($scores) > 0 ? array_search($lowestScore, $scores) : null;

        return $this->state(fn (array $attributes) => [
            'scores' => $scores,
            'average_score' => $averageScore,
            'lowest_dimension' => $lowestDimension,
            'lowest_score' => $lowestScore,
        ]);
    }

    /**
     * Create a high-performing observation (average > 3.5).
     */
    public function highPerforming(): static
    {
        $scores = [
            'Teaching Clarity' => fake()->randomFloat(1, 3.5, 4),
            'Student Engagement' => fake()->randomFloat(1, 3.5, 4),
            'Classroom Management' => fake()->randomFloat(1, 3.5, 4),
            'Content Knowledge' => fake()->randomFloat(1, 3.5, 4),
        ];

        return $this->withScores($scores);
    }

    /**
     * Create a low-performing observation (average < 3.0).
     */
    public function lowPerforming(): static
    {
        $scores = [
            'Teaching Clarity' => fake()->randomFloat(1, 1, 2.9),
            'Student Engagement' => fake()->randomFloat(1, 1, 2.9),
            'Classroom Management' => fake()->randomFloat(1, 1, 2.9),
            'Content Knowledge' => fake()->randomFloat(1, 1, 2.9),
        ];

        return $this->withScores($scores);
    }

    /**
     * Create an observation for a specific teacher.
     */
    public function forTeacher(Teacher $teacher): static
    {
        return $this->state(fn (array $attributes) => [
            'teacher_id' => $teacher->id,
        ]);
    }

    /**
     * Create an observation with a specific evaluation tool.
     */
    public function forEvaluationTool(EvaluationTool $tool): static
    {
        return $this->state(fn (array $attributes) => [
            'evaluation_tool_id' => $tool->id,
        ]);
    }

    /**
     * Create an observation with a specific observer.
     */
    public function forObserver(Observer $observer): static
    {
        return $this->state(fn (array $attributes) => [
            'observer_id' => $observer->id,
        ]);
    }
}
