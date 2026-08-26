<?php

namespace App\Repositories;

use App\Models\ContactHistory;
use App\Repositories\Contracts\ContactHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ContactHistoryRepository implements ContactHistoryRepositoryInterface
{
    public function find(int $id): ?ContactHistory
    {
        return ContactHistory::find($id);
    }

    public function listByCustomer(int $customerId): Collection
    {
        return ContactHistory::with(['createdByUser'])
            ->where('customer_id', $customerId)
            ->latest('created_at')
            ->get();
    }

    public function create(array $data): ContactHistory
    {
        return ContactHistory::create($data);
    }

    public function delete(ContactHistory $contactHistory): void
    {
        $contactHistory->delete();
    }
}
