<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// Reader-only routes
Route::middleware(['auth', 'role:reader'])->group(function () {
    Route::get('/books', [BookController::class, 'index']);        // view books
    Route::post('/request/{book}', [BookRequestController::class, 'store']); // submit request
    Route::get('/my-requests', [BookRequestController::class, 'myRequests']); // view status
});
