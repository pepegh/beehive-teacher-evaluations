<?php

namespace Tests\Feature\Api;

use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_teachers(): void
    {
        Teacher::factory()->count(5)->create();

        $response = $this->getJson('/api/teachers');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_teachers_are_ordered_by_created_at_descending(): void
    {
        $oldTeacher = Teacher::factory()->create(['created_at' => now()->subDays(5)]);
        $newTeacher = Teacher::factory()->create(['created_at' => now()]);

        $response = $this->getJson('/api/teachers');

        $response->assertStatus(200);
        $teachers = $response->json();
        $this->assertEquals($newTeacher->id, $teachers[0]['id']);
        $this->assertEquals($oldTeacher->id, $teachers[1]['id']);
    }

    public function test_can_create_teacher_with_valid_data(): void
    {
        $teacherData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'department' => 'english',
            'level' => 'primaria',
        ];

        $response = $this->postJson('/api/teachers', $teacherData);

        $response->assertStatus(201)
            ->assertJsonFragment(['first_name' => 'John'])
            ->assertJsonFragment(['last_name' => 'Doe']);

        $this->assertDatabaseHas('teachers', [
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);
    }

    public function test_creating_teacher_requires_first_name(): void
    {
        $teacherData = [
            'last_name' => 'Doe',
            'department' => 'english',
            'level' => 'primaria',
        ];

        $response = $this->postJson('/api/teachers', $teacherData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name']);
    }

    public function test_creating_teacher_requires_last_name(): void
    {
        $teacherData = [
            'first_name' => 'John',
            'department' => 'english',
            'level' => 'primaria',
        ];

        $response = $this->postJson('/api/teachers', $teacherData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['last_name']);
    }

    public function test_creating_teacher_requires_valid_department(): void
    {
        $teacherData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'department' => 'invalid',
            'level' => 'primaria',
        ];

        $response = $this->postJson('/api/teachers', $teacherData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['department']);
    }

    public function test_creating_teacher_requires_valid_level(): void
    {
        $teacherData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'department' => 'english',
            'level' => 'invalid',
        ];

        $response = $this->postJson('/api/teachers', $teacherData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['level']);
    }

    public function test_creating_teacher_with_duplicate_email_fails(): void
    {
        Teacher::factory()->create(['email' => 'existing@example.com']);

        $teacherData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'existing@example.com',
            'department' => 'english',
            'level' => 'primaria',
        ];

        $response = $this->postJson('/api/teachers', $teacherData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_can_show_single_teacher(): void
    {
        $teacher = Teacher::factory()->create();

        $response = $this->getJson("/api/teachers/{$teacher->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $teacher->id])
            ->assertJsonFragment(['first_name' => $teacher->first_name]);
    }

    public function test_showing_nonexistent_teacher_returns_404(): void
    {
        $response = $this->getJson('/api/teachers/999');

        $response->assertStatus(404);
    }

    public function test_can_update_teacher(): void
    {
        $teacher = Teacher::factory()->create();

        $updateData = [
            'first_name' => 'Updated Name',
        ];

        $response = $this->putJson("/api/teachers/{$teacher->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['first_name' => 'Updated Name']);

        $this->assertDatabaseHas('teachers', [
            'id' => $teacher->id,
            'first_name' => 'Updated Name',
        ]);
    }

    public function test_updating_teacher_email_allows_same_email(): void
    {
        $teacher = Teacher::factory()->create(['email' => 'test@example.com']);

        $updateData = [
            'email' => 'test@example.com',
        ];

        $response = $this->putJson("/api/teachers/{$teacher->id}", $updateData);

        $response->assertStatus(200);
    }

    public function test_can_delete_teacher(): void
    {
        $teacher = Teacher::factory()->create();

        $response = $this->deleteJson("/api/teachers/{$teacher->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('teachers', ['id' => $teacher->id]);
    }
}
