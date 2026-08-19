<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexCustomerRequest;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Responses\CustomerJsonResponse;
use App\UseCases\Customer\CreateCustomerUseCase;
use App\UseCases\Customer\DeleteCustomerUseCase;
use App\UseCases\Customer\GetCustomerUseCase;
use App\UseCases\Customer\ListCustomersUseCase;
use App\UseCases\Customer\UpdateCustomerUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function index(IndexCustomerRequest $request, ListCustomersUseCase $useCase): AnonymousResourceCollection
    {
        $customers = $useCase->execute($request->validated());

        return CustomerJsonResponse::collection($customers);
    }

    public function show(int $id, GetCustomerUseCase $useCase): CustomerJsonResponse
    {
        return new CustomerJsonResponse($useCase->execute($id));
    }

    public function store(StoreCustomerRequest $request, CreateCustomerUseCase $useCase): CustomerJsonResponse
    {
        return new CustomerJsonResponse($useCase->execute($request->validated()));
    }

    public function update(UpdateCustomerRequest $request, int $id, UpdateCustomerUseCase $useCase): CustomerJsonResponse
    {
        return new CustomerJsonResponse($useCase->execute($id, $request->validated()));
    }

    public function destroy(int $id, DeleteCustomerUseCase $useCase): JsonResponse
    {
        $useCase->execute($id);

        return response()->json(status: 204);
    }
}
