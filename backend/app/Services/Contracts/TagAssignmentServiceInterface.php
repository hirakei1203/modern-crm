<?php

namespace App\Services\Contracts;

use App\Models\Customer;

interface TagAssignmentServiceInterface
{
    public function assignTags(Customer $customer, array $tagIds): void;
}
