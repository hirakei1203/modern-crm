<?php

namespace App\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;

class UpdateCustomerUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function execute(int $id, array $data): Customer
    {
        $customer = $this->repository->find($id);

        if (! $customer) {
            throw new CustomerNotFoundException($id);
        }

        return $this->repository->update($customer, $data);
    }
}
