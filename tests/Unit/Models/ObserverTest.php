<?php

namespace Tests\Unit\Models;

use App\Enums\Department;
use App\Models\Observation;
use App\Models\Observer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ObserverTest extends TestCase
{
    use RefreshDatabase;

    public function test_observer_has_many_observations(): void
    {
        $observer = Observer::factory()->create();
        Observation::factory()->count(3)->forObserver($observer)->create();

        $this->assertCount(3, $observer->observations);
        $this->assertInstanceOf(Observation::class, $observer->observations->first());
    }

    public function test_observer_department_is_cast_to_enum(): void
    {
        $observer = Observer::factory()->create([
            'department' => 'english',
        ]);

        $this->assertInstanceOf(Department::class, $observer->department);
        $this->assertEquals(Department::ENGLISH, $observer->department);
    }

    public function test_observer_department_spanish_is_cast_correctly(): void
    {
        $observer = Observer::factory()->spanish()->create();

        $this->assertInstanceOf(Department::class, $observer->department);
        $this->assertEquals(Department::SPANISH, $observer->department);
    }

    public function test_observer_factory_creates_valid_observer(): void
    {
        $observer = Observer::factory()->create();

        $this->assertDatabaseHas('observers', [
            'id' => $observer->id,
            'name' => $observer->name,
        ]);
    }

    public function test_observer_fillable_attributes_can_be_mass_assigned(): void
    {
        $observer = Observer::create([
            'name' => 'Test Observer',
            'department' => 'english',
        ]);

        $this->assertEquals('Test Observer', $observer->name);
        $this->assertEquals(Department::ENGLISH, $observer->department);
    }
}
