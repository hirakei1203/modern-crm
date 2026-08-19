<?php

namespace App\UseCases\Customer;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;

class CreateCustomerUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function execute(array $data): Customer
    {
        return $this->repository->create($data);
    }
}
