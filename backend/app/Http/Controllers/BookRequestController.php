<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookRequestController extends Controller
use App\Models\Book;
use App\Models\BookRequest;

class BookRequestController extends Controller
{
    public function store(Book $book)
    {
        $user = auth()->user();

        // Borrowing limit check (max 3 active requests)
        $activeRequests = BookRequest::where('user_id', $user->id)
                                     ->whereIn('status', ['pending', 'approved'])
                                     ->count();
        if ($activeRequests >= 3) {
            return back()->with('error', 'You cannot borrow more than 3 books.');
        }

        // Duplicate request check
        $duplicate = BookRequest::where('user_id', $user->id)
                                ->where('book_id', $book->id)
                                ->where('status', 'pending')
                                ->exists();
        if ($duplicate) {
            return back()->with('error', 'You already requested this book.');
        }

        // Availability check
        if ($book->quantity <= 0) {
            return back()->with('error', 'Book is not available.');
        }

        // Create request
        BookRequest::create([
            'user_id' => $user->id,
            'book_id' => $book->id,
            'status'  => 'pending',
        ]);

        return back()->with('success', 'Request submitted successfully!');
    }

    public function myRequests()
    {
        // Fetch all requests for the logged-in reader
        $requests = BookRequest::where('user_id', auth()->id())
                               ->with('book')
                               ->orderBy('created_at', 'desc')
                               ->get();

        return view('reader.requests.index', compact('requests'));
    }
    //
}
