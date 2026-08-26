<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerLinkRequest;
use App\Http\Requests\UpdateCustomerLinkRequest;
use App\Http\Responses\CustomerLinkJsonResponse;
use App\UseCases\CustomerLink\CreateCustomerLinkUseCase;
use App\UseCases\CustomerLink\DeleteCustomerLinkUseCase;
use App\UseCases\CustomerLink\ListCustomerLinksUseCase;
use App\UseCases\CustomerLink\UpdateCustomerLinkUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerLinkController extends Controller
{
    public function index(int $customer, ListCustomerLinksUseCase $useCase): AnonymousResourceCollection
    {
        $customerLinks = $useCase->execute($customer);

        return CustomerLinkJsonResponse::collection($customerLinks);
    }

    public function store(StoreCustomerLinkRequest $request, int $customer, CreateCustomerLinkUseCase $useCase): CustomerLinkJsonResponse
    {
        return new CustomerLinkJsonResponse($useCase->execute($customer, $request->validated()));
    }

    public function update(UpdateCustomerLinkRequest $request, int $id, UpdateCustomerLinkUseCase $useCase): CustomerLinkJsonResponse
    {
        return new CustomerLinkJsonResponse($useCase->execute($id, $request->validated()));
    }

    public function destroy(int $id, DeleteCustomerLinkUseCase $useCase): JsonResponse
    {
        $useCase->execute($id);

        return response()->json(status: 204);
    }
}
