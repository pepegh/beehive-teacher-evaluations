<?php

namespace Database\Factories;

use App\Enums\Department;
use App\Models\Observer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Observer>
 */
class ObserverFactory extends Factory
{
    protected $model = Observer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'department' => fake()->randomElement(Department::cases())->value,
        ];
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
