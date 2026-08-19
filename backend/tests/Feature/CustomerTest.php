<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/customers')->assertStatus(401);
    }

    public function test_index_returns_a_paginated_list(): void
    {
        $user = User::factory()->create();
        Customer::factory()->count(3)->create();

        $this->actingAs($user)
            ->getJson('/api/customers')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_index_filters_by_search(): void
    {
        $user = User::factory()->create();
        Customer::factory()->create(['name' => 'Alice Johnson']);
        Customer::factory()->create(['name' => 'Bob Smith']);

        $this->actingAs($user)
            ->getJson('/api/customers?search=Alice')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Alice Johnson');
    }

    public function test_index_filters_by_assigned_to(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Customer::factory()->create(['assigned_to' => $user->id]);
        Customer::factory()->create(['assigned_to' => $other->id]);

        $this->actingAs($user)
            ->getJson("/api/customers?assigned_to={$user->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_show_returns_the_customer(): void
    {
        $user = User::factory()->create();
        $customer = Customer::factory()->create();

        $this->actingAs($user)
            ->getJson("/api/customers/{$customer->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $customer->id);
    }

    public function test_show_returns_404_when_not_found(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/customers/999')
            ->assertStatus(404);
    }

    public function test_store_creates_a_customer(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/customers', [
                'name' => 'Jane Doe',
                'company' => 'Acme Inc.',
                'email' => 'jane@example.com',
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Jane Doe');

        $this->assertDatabaseHas('customers', ['email' => 'jane@example.com']);
    }

    public function test_store_requires_a_name(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/customers', [])
            ->assertStatus(422);
    }

    public function test_store_rejects_a_duplicate_email(): void
    {
        $user = User::factory()->create();
        Customer::factory()->create(['email' => 'dup@example.com']);

        $this->actingAs($user)
            ->postJson('/api/customers', ['name' => 'Someone', 'email' => 'dup@example.com'])
            ->assertStatus(422);
    }

    public function test_update_modifies_the_customer(): void
    {
        $user = User::factory()->create();
        $customer = Customer::factory()->create(['name' => 'Old Name']);

        $this->actingAs($user)
            ->putJson("/api/customers/{$customer->id}", ['name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'name' => 'New Name']);
    }

    public function test_update_returns_404_when_not_found(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->putJson('/api/customers/999', ['name' => 'New Name'])
            ->assertStatus(404);
    }

    public function test_destroy_deletes_the_customer(): void
    {
        $user = User::factory()->create();
        $customer = Customer::factory()->create();

        $this->actingAs($user)
            ->deleteJson("/api/customers/{$customer->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }

    public function test_destroy_returns_404_when_not_found(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->deleteJson('/api/customers/999')
            ->assertStatus(404);
    }
}
