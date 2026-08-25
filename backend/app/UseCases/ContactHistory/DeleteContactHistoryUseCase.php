<?php

namespace App\UseCases\ContactHistory;

use App\Exceptions\ContactHistoryNotFoundException;
use App\Repositories\Contracts\ContactHistoryRepositoryInterface;

class DeleteContactHistoryUseCase
{
    public function __construct(
        private ContactHistoryRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $contactHistory = $this->repository->find($id);

        if (! $contactHistory) {
            throw new ContactHistoryNotFoundException($id);
        }

        $this->repository->delete($contactHistory);
    }
}
