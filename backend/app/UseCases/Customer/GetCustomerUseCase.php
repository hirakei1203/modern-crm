<?php

namespace App\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;

class GetCustomerUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function execute(int $id): Customer
    {
        $customer = $this->repository->find($id);

        if (! $customer) {
            throw new CustomerNotFoundException($id);
        }

        return $customer;
    }
}
