<?php

namespace App\UseCases\Task;

use App\Exceptions\TaskNotFoundException;
use App\Repositories\Contracts\TaskRepositoryInterface;

class DeleteTaskUseCase
{
    public function __construct(
        private TaskRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $task = $this->repository->find($id);

        if (! $task) {
            throw new TaskNotFoundException($id);
        }

        $this->repository->delete($task);
    }
}
