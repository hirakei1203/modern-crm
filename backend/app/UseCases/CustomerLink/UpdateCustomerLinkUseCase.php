<?php

namespace App\UseCases\CustomerLink;

use App\Exceptions\CustomerLinkNotFoundException;
use App\Models\CustomerLink;
use App\Repositories\Contracts\CustomerLinkRepositoryInterface;

class UpdateCustomerLinkUseCase
{
    public function __construct(
        private CustomerLinkRepositoryInterface $repository
    ) {}

    public function execute(int $id, array $data): CustomerLink
    {
        $customerLink = $this->repository->find($id);

        if (! $customerLink) {
            throw new CustomerLinkNotFoundException($id);
        }

        return $this->repository->update($customerLink, $data);
    }
}
