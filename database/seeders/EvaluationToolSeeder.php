<?php

namespace Database\Seeders;

use App\Models\EvaluationTool;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvaluationToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evaluationTools = [
            [
                'id' => 1,
                'name' => 'ELEOT',
                'description' => '',
                'dimensions' => [
                    'A',
                    'B',
                    'C',
                    'D',
                    'E',
                    'F',
                    'G',
                ],
            ],
            [
                'id' => 2,
                'name' => 'TOT',
                'description' => '',
                'dimensions' => [
                    'H',
                    'I',
                    'J',
                ],
            ],
        ];

        foreach ($evaluationTools as $tool) {
            EvaluationTool::create($tool);
        }
    }
}
