<?php

namespace App\UseCases\Task;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;

class CreateTaskUseCase
{
    public function __construct(
        private TaskRepositoryInterface $repository
    ) {}

    public function execute(int $customerId, array $data): Task
    {
        $data['customer_id'] = $customerId;
        $data['created_by'] = auth()->id();
        $data['is_done'] = false;

        return $this->repository->create($data);
    }
}
