<?php

namespace App\Repositories\Contracts;

use App\Models\ContactHistory;
use Illuminate\Database\Eloquent\Collection;

interface ContactHistoryRepositoryInterface
{
    public function find(int $id): ?ContactHistory;

    public function listByCustomer(int $customerId): Collection;

    public function create(array $data): ContactHistory;

    public function delete(ContactHistory $contactHistory): void;
}
