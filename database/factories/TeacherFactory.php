<?php

namespace Database\Factories;

use App\Enums\Department;
use App\Enums\Level;
use App\Enums\Status;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional(0.3)->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'subject' => fake()->randomElement(['Mathematics', 'Science', 'English', 'History', 'Art']),
            'department' => fake()->randomElement(Department::cases())->value,
            'level' => fake()->randomElement(Level::cases())->value,
            'hire_date' => fake()->dateTimeBetween('-5 years', 'now'),
            'status' => Status::ACTIVE->value,
        ];
    }

    /**
     * Indicate that the teacher is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Status::INACTIVE->value,
        ]);
    }

    /**
     * Indicate that the teacher is on leave.
     */
    public function onLeave(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Status::ON_LEAVE->value,
        ]);
    }

    /**
     * Set the department to English.
     */
    public function english(): static
    {
        return $this->state(fn (array $attributes) => [
            'department' => Department::ENGLISH->value,
        ]);
    }

    /**
     * Set the department to Spanish.
     */
    public function spanish(): static
    {
        return $this->state(fn (array $attributes) => [
            'department' => Department::SPANISH->value,
        ]);
    }
}
