<?php

namespace Database\Seeders;

use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = [
            ['id' => 1, 'first_name' => 'María', 'middle_name' => 'Fernanda', 'last_name' => 'Turcios Mogollón', 'email' => null, 'subject' => 'Maestra de Nursery', 'department' => 'english', 'level' => 'preprimaria', 'hire_date' => '2020-08-15', 'status' => 'active'],
            ['id' => 2, 'first_name' => 'Veronica', 'middle_name' => null, 'last_name' => 'Hernández Yac', 'email' => null, 'subject' => 'Maestra de Párvulos Español', 'department' => 'spanish', 'level' => 'preprimaria', 'hire_date' => '2019-07-01', 'status' => 'active'],
            ['id' => 3, 'first_name' => 'Zoe', 'middle_name' => null, 'last_name' => 'Cifuentes', 'email' => null, 'subject' => 'Maestra de Párvulos Ingles', 'department' => 'english', 'level' => 'preprimaria', 'hire_date' => '2021-08-20', 'status' => 'active'],
            ['id' => 4, 'first_name' => 'Lesly', 'middle_name' => 'Yojana', 'last_name' => 'González Díaz', 'email' => null, 'subject' => 'Maestra de Kínder Español', 'department' => 'english', 'level' => 'preprimaria', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 5, 'first_name' => 'Brenda', 'middle_name' => 'Lily', 'last_name' => 'Rodas Valdez', 'email' => null, 'subject' => 'Maestra de Kínder Ingles', 'department' => 'spanish', 'level' => 'preprimaria', 'hire_date' => '2020-08-15', 'status' => 'active'],
            ['id' => 6, 'first_name' => 'Gabriela', 'middle_name' => 'Nataly', 'last_name' => 'Ola Cayax', 'email' => null, 'subject' => 'Maestra de  Preparatoria Español', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2021-08-20', 'status' => 'active'],
            ['id' => 7, 'first_name' => 'Jennifer', 'middle_name' => null, 'last_name' => 'Martínez', 'email' => null, 'subject' => 'Maestra de  Preparatoria Ingles', 'department' => 'english', 'level' => 'primaria', 'hire_date' => '2022-08-15', 'status' => 'active'],
            ['id' => 8, 'first_name' => 'Cinthia', 'middle_name' => null, 'last_name' => 'Morales', 'email' => null, 'subject' => 'Maestra de  Primero Español', 'department' => 'english', 'level' => 'primaria', 'hire_date' => '2020-08-15', 'status' => 'active'],
            ['id' => 9, 'first_name' => 'Indira', 'middle_name' => null, 'last_name' => 'Ordoñez', 'email' => null, 'subject' => 'Maestra de  Primero Inglés', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2019-07-01', 'status' => 'active'],
            ['id' => 10, 'first_name' => 'Mimi', 'middle_name' => null, 'last_name' => 'Herrera', 'email' => null, 'subject' => 'Maestra Segundo "A"', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2022-08-15', 'status' => 'active'],
            ['id' => 11, 'first_name' => 'Alejandra', 'middle_name' => null, 'last_name' => 'Paniagua', 'email' => null, 'subject' => 'Maestra Segundo "B"', 'department' => 'english', 'level' => 'primaria', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 12, 'first_name' => 'Veronica', 'middle_name' => null, 'last_name' => 'Molina', 'email' => null, 'subject' => 'Maestra Tercero "A"', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2020-08-15', 'status' => 'active'],
            ['id' => 13, 'first_name' => 'Pahola', 'middle_name' => null, 'last_name' => 'Rodríguez', 'email' => null, 'subject' => 'Maestra Tercero "B"', 'department' => 'english', 'level' => 'primaria', 'hire_date' => '2019-07-01', 'status' => 'active'],
            ['id' => 14, 'first_name' => 'Pricila', 'middle_name' => null, 'last_name' => 'Bámaca', 'email' => null, 'subject' => 'Maestra Ciencias', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2021-08-20', 'status' => 'active'],
            ['id' => 15, 'first_name' => 'Misael', 'middle_name' => null, 'last_name' => 'Tale', 'email' => null, 'subject' => 'Maestro Matemáticas', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 16, 'first_name' => 'Claudia', 'middle_name' => null, 'last_name' => 'Díaz', 'email' => null, 'subject' => 'Maestra Quinto "B"', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2019-07-01', 'status' => 'active'],
            ['id' => 17, 'first_name' => 'Shirley', 'middle_name' => null, 'last_name' => 'Chacón Galler', 'email' => null, 'subject' => 'Maestra Lenguaje', 'department' => 'spanish', 'level' => 'primaria', 'hire_date' => '2021-08-20', 'status' => 'active'],
            ['id' => 18, 'first_name' => 'Judith', 'middle_name' => null, 'last_name' => 'González', 'email' => null, 'subject' => 'Maestra Lenguaje - Seminario', 'department' => 'spanish', 'level' => 'bys', 'hire_date' => '2022-08-15', 'status' => 'active'],
            ['id' => 19, 'first_name' => 'Alejandra', 'middle_name' => null, 'last_name' => 'Aguilar', 'email' => null, 'subject' => 'Maestro Lenguaje', 'department' => 'spanish', 'level' => 'bys', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 20, 'first_name' => 'Yeniffer', 'middle_name' => null, 'last_name' => 'Culajay', 'email' => null, 'subject' => 'Maestro de Matemáticas', 'department' => 'spanish', 'level' => 'bys', 'hire_date' => '2020-08-15', 'status' => 'active'],
            ['id' => 21, 'first_name' => 'Allan', 'middle_name' => null, 'last_name' => 'Solis', 'email' => null, 'subject' => 'Maestro de Matemáticas', 'department' => 'spanish', 'level' => 'bys', 'hire_date' => '2019-07-01', 'status' => 'active'],
            ['id' => 22, 'first_name' => 'Eduardo', 'middle_name' => null, 'last_name' => 'Barahona', 'email' => null, 'subject' => 'Maestra de Grammar', 'department' => 'english', 'level' => 'bys', 'hire_date' => '2021-08-20', 'status' => 'active'],
            ['id' => 23, 'first_name' => 'Marcell', 'middle_name' => null, 'last_name' => 'Villalobos', 'email' => null, 'subject' => 'Maestro World History', 'department' => 'english', 'level' => 'bys', 'hire_date' => '2022-08-15', 'status' => 'active'],
            ['id' => 24, 'first_name' => 'Cesar', 'middle_name' => null, 'last_name' => 'Arana', 'email' => null, 'subject' => 'Maestro de Science', 'department' => 'english', 'level' => 'bys', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 25, 'first_name' => 'William', 'middle_name' => null, 'last_name' => 'Carrillo', 'email' => null, 'subject' => 'Maestro de Math', 'department' => 'english', 'level' => 'bys', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 26, 'first_name' => 'Rocio', 'middle_name' => null, 'last_name' => 'Montejo', 'email' => null, 'subject' => 'Maestra de Social', 'department' => 'english', 'level' => 'bys', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 27, 'first_name' => 'Melanie', 'middle_name' => null, 'last_name' => 'Godinez', 'email' => null, 'subject' => 'Maestro Computación', 'department' => 'spanish', 'level' => 'areas_practicas', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 28, 'first_name' => 'Jonathan', 'middle_name' => null, 'last_name' => 'Soberanis', 'email' => null, 'subject' => 'Maestro de Robotica', 'department' => 'spanish', 'level' => 'areas_practicas', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 29, 'first_name' => 'Martin', 'middle_name' => null, 'last_name' => 'Caxaj', 'email' => null, 'subject' => 'Maestro de K´iche', 'department' => 'spanish', 'level' => 'bys', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 30, 'first_name' => 'Rey', 'middle_name' => null, 'last_name' => 'Rodríguez', 'email' => null, 'subject' => 'Maestro de Pintura', 'department' => 'spanish', 'level' => 'especialidad', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 31, 'first_name' => 'Efraín', 'middle_name' => null, 'last_name' => 'Castro', 'email' => null, 'subject' => 'Maestro de ciencias de la salud', 'department' => 'spanish', 'level' => 'especialidad', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 32, 'first_name' => 'Andrea', 'middle_name' => null, 'last_name' => 'Oliva', 'email' => null, 'subject' => 'Emprendimiento', 'department' => 'spanish', 'level' => 'bys', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 33, 'first_name' => 'Dayana', 'middle_name' => null, 'last_name' => 'Martínez', 'email' => null, 'subject' => 'Maestro de Música', 'department' => 'spanish', 'level' => 'areas_practicas', 'hire_date' => '2017-08-10', 'status' => 'active'],
            ['id' => 34, 'first_name' => 'Sebastian', 'middle_name' => null, 'last_name' => 'de Paz', 'email' => null, 'subject' => 'Maestro Deporte', 'department' => 'spanish', 'level' => 'areas_practicas', 'hire_date' => null, 'status' => 'active'],
            ['id' => 35, 'first_name' => 'Orlando', 'middle_name' => null, 'last_name' => 'Xicará Cua', 'email' => null, 'subject' => 'Maestro Computación', 'department' => 'spanish', 'level' => 'areas_practicas', 'hire_date' => null, 'status' => 'active'],
        ];

        foreach ($teachers as $teacher) {
            Teacher::create($teacher);
        }
    }
}
