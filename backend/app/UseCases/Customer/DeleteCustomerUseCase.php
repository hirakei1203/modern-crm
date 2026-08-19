<?php

namespace App\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Repositories\Contracts\CustomerRepositoryInterface;

class DeleteCustomerUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $customer = $this->repository->find($id);

        if (! $customer) {
            throw new CustomerNotFoundException($id);
        }

        $this->repository->delete($customer);
    }
}
