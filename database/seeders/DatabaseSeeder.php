<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed in order to satisfy foreign key constraints
        $this->call([
            TeacherSeeder::class,
            ObserverSeeder::class,
            EvaluationToolSeeder::class,
            ObservationSeeder::class,
        ]);
    }
}
