<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();

        return $admin;
    }

    public function test_member_can_view_user_list(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('user.index'))
            ->assertOk();
    }

    public function test_member_cannot_delete_a_user(): void
    {
        $target = User::factory()->create();

        $this->actingAs(User::factory()->create())
            ->delete(route('user.destroy', $target))
            ->assertForbidden();
    }

    public function test_admin_can_delete_another_user(): void
    {
        $target = User::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('user.destroy', $target))
            ->assertRedirect(route('user.index'));
    }

    public function test_admin_cannot_delete_own_account(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->delete(route('user.destroy', $admin))
            ->assertForbidden();
    }
}