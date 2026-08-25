<?php

namespace App\UseCases\Tag;

use App\Models\Tag;
use App\Repositories\Contracts\TagRepositoryInterface;

class CreateTagUseCase
{
    public function __construct(
        private TagRepositoryInterface $repository
    ) {}

    public function execute(array $data): Tag
    {
        $data['created_by'] = auth()->id();

        return $this->repository->create($data);
    }
}
