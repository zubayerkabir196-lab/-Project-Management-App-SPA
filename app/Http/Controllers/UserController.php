<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', User::class);

        $query = User::query();

        $sortField = in_array(request('sort_field'), ['id', 'name', 'email', 'created_at'], true)
            ? request('sort_field')
            : 'created_at';
        $sortDirection = request('sort_direction') === 'asc' ? 'asc' : 'desc';

        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if (request('email')) {
            $query->where('email', 'like', '%' . request('email') . '%');
        }

        $users = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)->onEachSide(1);

        return inertia('User/Index', [
            'users'       => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success'     => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);

        return inertia('User/Create');
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);

        $data = $request->validated();
        $data['email_verified_at'] = now();
        $data['password'] = bcrypt($data['password']);
        User::create($data);

        return to_route('user.index')->with('success', 'User Was Created');
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);
    }

    public function edit(User $user)
    {
        Gate::authorize('update', $user);

        return inertia('User/Edit', [
            'user' => new UserCrudResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);

        $data = $request->validated();
        $password = $data['password'] ?? null;
        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }
        $user->update($data);

        return to_route('user.index')
            ->with('success', "user \"$user->name\" was updated");
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $name = $user->name;
        $user->delete();

        return to_route('user.index')
            ->with('success', "user '$name' was deleted");
    }
}
