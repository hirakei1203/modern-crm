<?php

namespace App\UseCases\Customer;

use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListCustomersUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function execute(array $filters): LengthAwarePaginator
    {
        return $this->repository->paginate($filters);
    }
}
