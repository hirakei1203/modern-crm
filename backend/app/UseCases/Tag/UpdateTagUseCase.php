<?php

namespace App\UseCases\Tag;

use App\Exceptions\TagNotFoundException;
use App\Models\Tag;
use App\Repositories\Contracts\TagRepositoryInterface;

class UpdateTagUseCase
{
    public function __construct(
        private TagRepositoryInterface $repository
    ) {}

    public function execute(int $id, array $data): Tag
    {
        $tag = $this->repository->find($id);

        if (! $tag) {
            throw new TagNotFoundException($id);
        }

        return $this->repository->update($tag, $data);
    }
}
