<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'=>fake()->sentence(),
            'description'=>fake()->realText(),
            'due_date'=>fake()->dateTimeBetween('now','+1 year'),
            'status'=>fake()->randomElement(['pending','in_progress',
            'completed']),
            'image_path' => 'https://placehold.co/640x480/009911/ffffff?text=' . fake()->word(),
            'created_by'=>1,
            'updated_by'=>1
        ];
    }
}
