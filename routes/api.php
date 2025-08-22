<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowRequestController;

// API Authentication endpoint
Route::post('/login', [AuthController::class, 'login']);

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/requests', [BorrowRequestController::class, 'store']);
    Route::get('/my-requests', [BorrowRequestController::class, 'index']);
});
