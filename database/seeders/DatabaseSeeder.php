<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'slo-mo',
            'email' => 'slowbaayer@gmail.com',
            'password'=>bcrypt('123.321A'),
            'email_verified_at'=>time()
        ]);

        Project::factory(30)
        ->count(30)
        ->has(Task::factory()->count(30), 'tasks')
        ->create();
    }
}
