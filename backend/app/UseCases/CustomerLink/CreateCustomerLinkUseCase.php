<?php

namespace App\UseCases\CustomerLink;

use App\Models\CustomerLink;
use App\Repositories\Contracts\CustomerLinkRepositoryInterface;

class CreateCustomerLinkUseCase
{
    public function __construct(
        private CustomerLinkRepositoryInterface $repository
    ) {}

    public function execute(int $customerId, array $data): CustomerLink
    {
        $data['customer_id'] = $customerId;

        return $this->repository->create($data);
    }
}
