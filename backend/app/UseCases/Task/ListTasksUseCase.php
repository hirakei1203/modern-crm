<?php

namespace App\UseCases\Task;

use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ListTasksUseCase
{
    public function __construct(
        private TaskRepositoryInterface $repository
    ) {}

    public function execute(int $customerId): Collection
    {
        return $this->repository->listByCustomer($customerId);
    }
}
