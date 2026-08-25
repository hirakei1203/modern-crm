<?php

namespace App\Repositories\Contracts;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function find(int $id): ?Customer;

    public function paginate(array $filters): LengthAwarePaginator;

    public function create(array $data): Customer;

    public function update(Customer $customer, array $data): Customer;

    public function delete(Customer $customer): void;

    public function syncTags(Customer $customer, array $tagIds): void;
}
