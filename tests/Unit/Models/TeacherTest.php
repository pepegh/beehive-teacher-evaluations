<?php

namespace Tests\Unit\Models;

use App\Enums\Department;
use App\Enums\Level;
use App\Enums\Status;
use App\Models\Observation;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_has_full_name_accessor(): void
    {
        $teacher = Teacher::factory()->create([
            'first_name' => 'John',
            'middle_name' => null,
            'last_name' => 'Doe',
        ]);

        $this->assertEquals('John Doe', $teacher->full_name);
    }

    public function test_teacher_full_name_includes_middle_name(): void
    {
        $teacher = Teacher::factory()->create([
            'first_name' => 'John',
            'middle_name' => 'Michael',
            'last_name' => 'Doe',
        ]);

        $this->assertEquals('John Michael Doe', $teacher->full_name);
    }

    public function test_teacher_has_many_observations(): void
    {
        $teacher = Teacher::factory()->create();
        Observation::factory()->count(3)->forTeacher($teacher)->create();

        $this->assertCount(3, $teacher->observations);
        $this->assertInstanceOf(Observation::class, $teacher->observations->first());
    }

    public function test_teacher_department_is_cast_to_enum(): void
    {
        $teacher = Teacher::factory()->create([
            'department' => 'english',
        ]);

        $this->assertInstanceOf(Department::class, $teacher->department);
        $this->assertEquals(Department::ENGLISH, $teacher->department);
    }

    public function test_teacher_level_is_cast_to_enum(): void
    {
        $teacher = Teacher::factory()->create([
            'level' => 'primaria',
        ]);

        $this->assertInstanceOf(Level::class, $teacher->level);
        $this->assertEquals(Level::PRIMARIA, $teacher->level);
    }

    public function test_teacher_status_is_cast_to_enum(): void
    {
        $teacher = Teacher::factory()->create([
            'status' => 'active',
        ]);

        $this->assertInstanceOf(Status::class, $teacher->status);
        $this->assertEquals(Status::ACTIVE, $teacher->status);
    }

    public function test_teacher_hire_date_is_cast_to_date(): void
    {
        $teacher = Teacher::factory()->create([
            'hire_date' => '2023-06-15',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $teacher->hire_date);
        $this->assertEquals('2023-06-15', $teacher->hire_date->format('Y-m-d'));
    }

    public function test_teacher_factory_creates_valid_teacher(): void
    {
        $teacher = Teacher::factory()->create();

        $this->assertDatabaseHas('teachers', [
            'id' => $teacher->id,
            'first_name' => $teacher->first_name,
            'last_name' => $teacher->last_name,
        ]);
    }
}
