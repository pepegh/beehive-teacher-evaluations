<?php

namespace Tests\Feature\Api;

use App\Models\Observer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ObserverControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_observers(): void
    {
        Observer::factory()->count(5)->create();

        $response = $this->getJson('/api/observers');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_observers_are_sorted_by_name(): void
    {
        Observer::factory()->create(['name' => 'Zack Observer']);
        Observer::factory()->create(['name' => 'Alice Observer']);

        $response = $this->getJson('/api/observers');

        $response->assertStatus(200);
        $observers = $response->json();
        $this->assertEquals('Alice Observer', $observers[0]['name']);
        $this->assertEquals('Zack Observer', $observers[1]['name']);
    }

    public function test_can_create_observer_with_valid_data(): void
    {
        $observerData = [
            'name' => 'Test Observer',
            'department' => 'english',
        ];

        $response = $this->postJson('/api/observers', $observerData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Observer']);

        $this->assertDatabaseHas('observers', [
            'name' => 'Test Observer',
            'department' => 'english',
        ]);
    }

    public function test_creating_observer_requires_name(): void
    {
        $observerData = [
            'department' => 'english',
        ];

        $response = $this->postJson('/api/observers', $observerData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_creating_observer_requires_department(): void
    {
        $observerData = [
            'name' => 'Test Observer',
        ];

        $response = $this->postJson('/api/observers', $observerData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['department']);
    }

    public function test_creating_observer_requires_valid_department(): void
    {
        $observerData = [
            'name' => 'Test Observer',
            'department' => 'invalid',
        ];

        $response = $this->postJson('/api/observers', $observerData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['department']);
    }

    public function test_can_show_single_observer(): void
    {
        $observer = Observer::factory()->create();

        $response = $this->getJson("/api/observers/{$observer->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $observer->id])
            ->assertJsonFragment(['name' => $observer->name]);
    }

    public function test_can_update_observer(): void
    {
        $observer = Observer::factory()->create();

        $updateData = [
            'name' => 'Updated Observer Name',
        ];

        $response = $this->putJson("/api/observers/{$observer->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated Observer Name']);

        $this->assertDatabaseHas('observers', [
            'id' => $observer->id,
            'name' => 'Updated Observer Name',
        ]);
    }

    public function test_can_delete_observer(): void
    {
        $observer = Observer::factory()->create();

        $response = $this->deleteJson("/api/observers/{$observer->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('observers', ['id' => $observer->id]);
    }
}
