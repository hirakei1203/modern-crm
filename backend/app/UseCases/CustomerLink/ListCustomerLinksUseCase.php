<?php

namespace App\UseCases\CustomerLink;

use App\Repositories\Contracts\CustomerLinkRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ListCustomerLinksUseCase
{
    public function __construct(
        private CustomerLinkRepositoryInterface $repository
    ) {}

    public function execute(int $customerId): Collection
    {
        return $this->repository->listByCustomer($customerId);
    }
}
