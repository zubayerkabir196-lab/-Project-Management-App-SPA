<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    // Everyone logged in can see the user list and a user
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, User $model): bool
    {
        return true;
    }

    // Only admins can create or edit users
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    // Only admins can delete, and never their own account
    public function delete(User $user, User $model): bool
    {
        return $user->isAdmin() && $user->id !== $model->id;
    }
}
