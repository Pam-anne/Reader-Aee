<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowRequestController;
use App\Http\Controllers\LibrarianController;

// Public Authentication endpoints
Route::post('/login', [AuthController::class, 'login']);

// Protected Authentication endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Student (Reader) routes - role:student
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/books', [BookController::class, 'index']);           // View available books
    Route::post('/requests', [BorrowRequestController::class, 'store']); // Submit request
    Route::get('/my-requests', [BorrowRequestController::class, 'index']); // View own requests
});

// Librarian routes - role:librarian
// Librarian routes - role:librarian
Route::middleware(['auth:sanctum', 'role:librarian'])->group(function () {
    Route::get('/requests/pending', [LibrarianController::class, 'pendingRequests']);
    Route::get('/requests/all', [LibrarianController::class, 'allRequests']);
    Route::post('/requests/{id}/approve', [LibrarianController::class, 'approve']);
    Route::post('/requests/{id}/reject', [LibrarianController::class, 'reject']);
    Route::get('/inventory', [LibrarianController::class, 'inventory']);
});

// Admin routes - role:admin
// Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
//     Route::get('/dashboard', [AdminController::class, 'dashboard']);
//     Route::get('/users', [AdminController::class, 'listUsers']);
//     Route::get('/logs', [AdminController::class, 'logs']);
// });
