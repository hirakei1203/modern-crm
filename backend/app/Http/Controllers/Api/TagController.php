<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Responses\TagJsonResponse;
use App\UseCases\Tag\CreateTagUseCase;
use App\UseCases\Tag\DeleteTagUseCase;
use App\UseCases\Tag\ListTagsUseCase;
use App\UseCases\Tag\UpdateTagUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    public function index(ListTagsUseCase $useCase): AnonymousResourceCollection
    {
        return TagJsonResponse::collection($useCase->execute());
    }

    public function store(StoreTagRequest $request, CreateTagUseCase $useCase): TagJsonResponse
    {
        return new TagJsonResponse($useCase->execute($request->validated()));
    }

    public function update(UpdateTagRequest $request, int $id, UpdateTagUseCase $useCase): TagJsonResponse
    {
        return new TagJsonResponse($useCase->execute($id, $request->validated()));
    }

    public function destroy(int $id, DeleteTagUseCase $useCase): JsonResponse
    {
        $useCase->execute($id);

        return response()->json(status: 204);
    }
}
