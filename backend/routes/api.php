<?php

use App\Http\Controllers\Api\ContactHistoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\CustomerLinkController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::apiResource('customers', CustomerController::class)->parameters(['customers' => 'id']);

    Route::get('customers/{customer}/tasks', [TaskController::class, 'index']);
    Route::post('customers/{customer}/tasks', [TaskController::class, 'store']);
    Route::put('tasks/{id}', [TaskController::class, 'update']);
    Route::delete('tasks/{id}', [TaskController::class, 'destroy']);

    Route::get('customers/{customer}/contact-histories', [ContactHistoryController::class, 'index']);
    Route::post('customers/{customer}/contact-histories', [ContactHistoryController::class, 'store']);
    Route::delete('contact-histories/{id}', [ContactHistoryController::class, 'destroy']);

    Route::apiResource('tags', TagController::class)->parameters(['tags' => 'id'])->except(['show']);

    Route::get('customers/{customer}/links', [CustomerLinkController::class, 'index']);
    Route::post('customers/{customer}/links', [CustomerLinkController::class, 'store']);
    Route::put('links/{id}', [CustomerLinkController::class, 'update']);
    Route::delete('links/{id}', [CustomerLinkController::class, 'destroy']);
});
