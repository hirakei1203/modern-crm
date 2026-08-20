<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function find(int $id): ?Customer
    {
        return Customer::with(['assignedUser'])->find($id);
    }

    public function paginate(array $filters): LengthAwarePaginator
    {
        return Customer::query()
            ->when($filters['assigned_to'] ?? null, fn ($q, $userId) =>
                $q->where('assigned_to', $userId)
            )
            ->when($filters['search'] ?? null, fn ($q, $search) =>
                $q->where(fn ($q) => $q
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                )
            )
            ->with(['assignedUser'])
            ->latest('updated_at')
            ->paginate(20);
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer;
    }

    public function delete(Customer $customer): void
    {
        $customer->delete();
    }
}
