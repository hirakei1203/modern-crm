<?php

namespace App\UseCases\ContactHistory;

use App\Repositories\Contracts\ContactHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ListContactHistoriesUseCase
{
    public function __construct(
        private ContactHistoryRepositoryInterface $repository
    ) {}

    public function execute(int $customerId): Collection
    {
        return $this->repository->listByCustomer($customerId);
    }
}
