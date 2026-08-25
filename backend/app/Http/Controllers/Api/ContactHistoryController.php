<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactHistoryRequest;
use App\Http\Responses\ContactHistoryJsonResponse;
use App\UseCases\ContactHistory\CreateContactHistoryUseCase;
use App\UseCases\ContactHistory\DeleteContactHistoryUseCase;
use App\UseCases\ContactHistory\ListContactHistoriesUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContactHistoryController extends Controller
{
    public function index(int $customer, ListContactHistoriesUseCase $useCase): AnonymousResourceCollection
    {
        $contactHistories = $useCase->execute($customer);

        return ContactHistoryJsonResponse::collection($contactHistories);
    }

    public function store(StoreContactHistoryRequest $request, int $customer, CreateContactHistoryUseCase $useCase): ContactHistoryJsonResponse
    {
        return new ContactHistoryJsonResponse($useCase->execute($customer, $request->validated()));
    }

    public function destroy(int $id, DeleteContactHistoryUseCase $useCase): JsonResponse
    {
        $useCase->execute($id);

        return response()->json(status: 204);
    }
}
