<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    private const SORTABLE = ['id', 'name', 'status', 'priority', 'due_date', 'created_at'];

    private function listTasks(Builder $query)
    {
        $sortField = in_array(request('sort_field'), self::SORTABLE, true)
            ? request('sort_field')
            : 'created_at';
        $sortDirection = request('sort_direction') === 'asc' ? 'asc' : 'desc';

        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if (request('status')) {
            $query->where('status', request('status'));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Task/index', [
            'tasks'       => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success'     => session('success'),
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->listTasks(Task::query());
    }

    /**
     * Tasks assigned to the logged-in user.
     */
    public function myTasks()
    {
        return $this->listTasks(
            Task::query()->where('assigned_user_id', Auth::id())
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users'    => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        Task::create($data);

        return to_route('task.index')->with('success', 'Task Was Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return inertia('Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        Gate::authorize('update', $task);

        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        return inertia("Task/Edit", [
            'task'     => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users'    => UserResource::collection($users),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);

        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        $task->update($data);

        return to_route('task.index')
            ->with('success', "Task \"$task->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $name = $task->name;
        $task->delete();
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        return to_route('task.index')
            ->with('success', "Task '$name' was deleted");
    }
}