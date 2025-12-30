<?php

namespace Database\Seeders;

use App\Models\Observer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ObserverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $observers = [
            ['id' => 1, 'name' => 'Yoselin Argueta', 'department' => 'english'],
            ['id' => 2, 'name' => 'Karla Bizerra', 'department' => 'spanish'],
            ['id' => 3, 'name' => 'Ingrid de León', 'department' => 'english'],
            ['id' => 4, 'name' => 'Mario coyoy', 'department' => 'spanish'],
            ['id' => 5, 'name' => 'Lorena Castillo', 'department' => 'english'],
            ['id' => 6, 'name' => 'Olga Hernandez', 'department' => 'spanish'],
            ['id' => 7, 'name' => 'Gabriela Ruiz', 'department' => 'spanish'],
        ];

        foreach ($observers as $observer) {
            Observer::create($observer);
        }
    }
}
