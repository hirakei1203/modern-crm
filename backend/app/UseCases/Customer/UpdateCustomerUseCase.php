<?php

namespace App\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Services\Contracts\TagAssignmentServiceInterface;

class UpdateCustomerUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository,
        private TagAssignmentServiceInterface $tagAssignmentService
    ) {}

    public function execute(int $id, array $data): Customer
    {
        $customer = $this->repository->find($id);

        if (! $customer) {
            throw new CustomerNotFoundException($id);
        }

        if (array_key_exists('tag_ids', $data)) {
            $tagIds = $data['tag_ids'];
            unset($data['tag_ids']);
            $this->tagAssignmentService->assignTags($customer, $tagIds);
        }

        return $this->repository->update($customer, $data);
    }
}
