<?php

namespace App\Http\Controllers;

use App\Models\BorrowRequest;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BorrowRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'borrowed_at' => 'required|date|after_or_equal:today',
            'due_date' => 'required|date|after:borrowed_at',
        ]);

        // Check if book exists and is available
        $book = Book::findOrFail($request->book_id);

        if ($book->status === 'borrowed') {
            throw ValidationException::withMessages([
                'book_id' => ['This book is currently not available.'],
            ]);
        }

        // Check if user already has a pending or approved request for this book
        $existingRequest = BorrowRequest::where('user_id', Auth::id())
            ->where('book_id', $request->book_id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingRequest) {
            throw ValidationException::withMessages([
                'book_id' => ['You already have an active request for this book.'],
            ]);
        }

        // Check borrowing limit (assume user can have max 3 active requests)
        $activeRequestsCount = BorrowRequest::where('user_id', Auth::id())
            ->whereIn('status', ['pending', 'approved'])
            ->count();

        if ($activeRequestsCount >= 3) {
            throw ValidationException::withMessages([
                'book_id' => ['You have reached the maximum borrowing limit of 3 books.'],
            ]);
        }

        $borrowRequest = BorrowRequest::create([
            'user_id' => Auth::id(),
            'book_id' => $request->book_id,
            'borrowed_at' => $request->borrowed_at,
            'due_date' => $request->due_date,
            'status' => 'pending',
        ]);

        $borrowRequest->load('book');

        return response()->json($borrowRequest, 201);
    }

    public function index()
    {
        $requests = BorrowRequest::with('book')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return response()->json($requests);
    }
}
