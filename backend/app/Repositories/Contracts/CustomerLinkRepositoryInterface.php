<?php

namespace App\Repositories\Contracts;

use App\Models\CustomerLink;
use Illuminate\Database\Eloquent\Collection;

interface CustomerLinkRepositoryInterface
{
    public function find(int $id): ?CustomerLink;

    public function listByCustomer(int $customerId): Collection;

    public function create(array $data): CustomerLink;

    public function update(CustomerLink $customerLink, array $data): CustomerLink;

    public function delete(CustomerLink $customerLink): void;
}
