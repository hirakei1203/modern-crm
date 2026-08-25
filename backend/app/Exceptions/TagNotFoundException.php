<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagNotFoundException extends Exception
{
    public function __construct(int $id)
    {
        parent::__construct("Tag not found: {$id}");
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], 404);
    }
}
