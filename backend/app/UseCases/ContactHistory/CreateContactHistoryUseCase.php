<?php

namespace App\UseCases\ContactHistory;

use App\Models\ContactHistory;
use App\Repositories\Contracts\ContactHistoryRepositoryInterface;

class CreateContactHistoryUseCase
{
    public function __construct(
        private ContactHistoryRepositoryInterface $repository
    ) {}

    public function execute(int $customerId, array $data): ContactHistory
    {
        $data['customer_id'] = $customerId;
        $data['created_by'] = auth()->id();
        $data['created_at'] = now();

        return $this->repository->create($data);
    }
}
