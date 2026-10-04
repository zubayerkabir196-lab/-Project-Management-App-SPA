<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
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
            'status'=>fake()
            ->randomElement(['pending','in_progress',
            'completed']),
            'priority'=>fake()
            ->randomElement(['low','medium','high']),
            'image_path' => 'https://picsum.photos/seed/'.fake()->uuid().'/640/480',
            'assigned_user_id'=>1,
            'created_by'=>1,
            'updated_by'=>1
        ];
    }
}
