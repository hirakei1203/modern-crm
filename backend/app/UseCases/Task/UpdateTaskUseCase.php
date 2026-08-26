<?php

namespace App\UseCases\Task;

use App\Exceptions\TaskNotFoundException;
use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;

class UpdateTaskUseCase
{
    public function __construct(
        private TaskRepositoryInterface $repository
    ) {}

    public function execute(int $id, array $data): Task
    {
        $task = $this->repository->find($id);

        if (! $task) {
            throw new TaskNotFoundException($id);
        }

        return $this->repository->update($task, $data);
    }
}
