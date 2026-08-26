<?php

namespace App\Repositories;

use App\Models\CustomerLink;
use App\Repositories\Contracts\CustomerLinkRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CustomerLinkRepository implements CustomerLinkRepositoryInterface
{
    public function find(int $id): ?CustomerLink
    {
        return CustomerLink::find($id);
    }

    public function listByCustomer(int $customerId): Collection
    {
        return CustomerLink::where('customer_id', $customerId)
            ->oldest('created_at')
            ->get();
    }

    public function create(array $data): CustomerLink
    {
        return CustomerLink::create($data);
    }

    public function update(CustomerLink $customerLink, array $data): CustomerLink
    {
        $customerLink->update($data);

        return $customerLink;
    }

    public function delete(CustomerLink $customerLink): void
    {
        $customerLink->delete();
    }
}
