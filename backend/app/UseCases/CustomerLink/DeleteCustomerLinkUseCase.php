<?php

namespace App\UseCases\CustomerLink;

use App\Exceptions\CustomerLinkNotFoundException;
use App\Repositories\Contracts\CustomerLinkRepositoryInterface;

class DeleteCustomerLinkUseCase
{
    public function __construct(
        private CustomerLinkRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $customerLink = $this->repository->find($id);

        if (! $customerLink) {
            throw new CustomerLinkNotFoundException($id);
        }

        $this->repository->delete($customerLink);
    }
}
