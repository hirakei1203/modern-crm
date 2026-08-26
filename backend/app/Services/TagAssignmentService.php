<?php

namespace App\Services;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Services\Contracts\TagAssignmentServiceInterface;

class TagAssignmentService implements TagAssignmentServiceInterface
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function assignTags(Customer $customer, array $tagIds): void
    {
        $this->repository->syncTags($customer, $tagIds);
    }
}
