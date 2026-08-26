<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Responses\TaskJsonResponse;
use App\UseCases\Task\CreateTaskUseCase;
use App\UseCases\Task\DeleteTaskUseCase;
use App\UseCases\Task\ListTasksUseCase;
use App\UseCases\Task\UpdateTaskUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function index(int $customer, ListTasksUseCase $useCase): AnonymousResourceCollection
    {
        $tasks = $useCase->execute($customer);

        return TaskJsonResponse::collection($tasks);
    }

    public function store(StoreTaskRequest $request, int $customer, CreateTaskUseCase $useCase): TaskJsonResponse
    {
        return new TaskJsonResponse($useCase->execute($customer, $request->validated()));
    }

    public function update(UpdateTaskRequest $request, int $id, UpdateTaskUseCase $useCase): TaskJsonResponse
    {
        return new TaskJsonResponse($useCase->execute($id, $request->validated()));
    }

    public function destroy(int $id, DeleteTaskUseCase $useCase): JsonResponse
    {
        $useCase->execute($id);

        return response()->json(status: 204);
    }
}
