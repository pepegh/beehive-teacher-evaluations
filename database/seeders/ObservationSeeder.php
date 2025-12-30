<?php

namespace Database\Seeders;

use App\Models\Observation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ObservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $observations = [
            [
                'id' => 1,
                'teacher_id' => 23,
                'evaluation_tool_id' => 1,
                'observer_id' => 5,
                'observation_date' => '2025-11-07',
                'scores' => [
                    'A' => 3.75,
                    'B' => 2.4,
                    'C' => 3.0,
                    'D' => 3.0,
                    'E' => 2.5,
                    'F' => 3.5,
                    'G' => 2.33,
                ],
                'notes' => null,
                'average_score' => 2.93,
                'lowest_dimension' => 'G',
                'lowest_score' => 2.33,
            ],
            [
                'id' => 2,
                'teacher_id' => 25,
                'evaluation_tool_id' => 1,
                'observer_id' => 5,
                'observation_date' => '2025-11-07',
                'scores' => [
                    'A' => 3.75,
                    'B' => 2.8,
                    'C' => 3.0,
                    'D' => 3.5,
                    'E' => 4.0,
                    'F' => 3.5,
                    'G' => 3.0,
                ],
                'notes' => null,
                'average_score' => 3.36,
                'lowest_dimension' => 'B',
                'lowest_score' => 2.8,
            ],
            [
                'id' => 3,
                'teacher_id' => 22,
                'evaluation_tool_id' => 1,
                'observer_id' => 5,
                'observation_date' => '2025-11-07',
                'scores' => [
                    'A' => 4.0,
                    'B' => 3.2,
                    'C' => 4.0,
                    'D' => 4.0,
                    'E' => 4.0,
                    'F' => 4.0,
                    'G' => 4.0,
                ],
                'notes' => null,
                'average_score' => 3.89,
                'lowest_dimension' => 'B',
                'lowest_score' => 3.2,
            ],
            [
                'id' => 4,
                'teacher_id' => 24,
                'evaluation_tool_id' => 1,
                'observer_id' => 5,
                'observation_date' => '2025-11-07',
                'scores' => [
                    'A' => 3.0,
                    'B' => 2.4,
                    'C' => 2.5,
                    'D' => 2.75,
                    'E' => 2.25,
                    'F' => 2.75,
                    'G' => 3.33,
                ],
                'notes' => null,
                'average_score' => 2.71,
                'lowest_dimension' => 'E',
                'lowest_score' => 2.25,
            ],
        ];

        foreach ($observations as $observation) {
            Observation::create($observation);
        }
    }
}
