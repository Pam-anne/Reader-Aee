<?php

namespace App\Http\Controllers;

use App\Models\BorrowRequest;
use App\Models\Book;
use App\Models\BookLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LibrarianController extends Controller
{
    /**
     * Get all pending book requests
     */
    public function pendingRequests()
    {
        try {
            $requests = BorrowRequest::with(['user', 'book'])
                ->where('status', 'pending')
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($request) {
                    return [
                        'id' => $request->id,
                        'request_date' => $request->created_at->format('Y-m-d H:i:s'),
                        'user' => [
                            'id' => $request->user->id,
                            'name' => $request->user->name,
                            'email' => $request->user->email,
                        ],
                        'book' => [
                            'id' => $request->book->id,
                            'title' => $request->book->title,
                            'author' => $request->book->author,
                            'isbn' => $request->book->isbn,
                            'available_quantity' => $request->book->available_quantity,
                        ],
                        'status' => $request->status,
                        'notes' => $request->notes,
                    ];
                });

            return response()->json([
                'message' => 'Pending requests retrieved successfully',
                'requests' => $requests,
                'count' => $requests->count()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving pending requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve a book request
     */
    public function approve(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            // Find the request
            $borrowRequest = BorrowRequest::with(['user', 'book'])->findOrFail($id);

            // Check if request is still pending
            if ($borrowRequest->status !== 'pending') {
                return response()->json([
                    'message' => 'Request has already been processed',
                    'current_status' => $borrowRequest->status
                ], 400);
            }

            // Check book availability
            $book = $borrowRequest->book;
            if ($book->available_quantity <= 0) {
                return response()->json([
                    'message' => 'Book is not available for borrowing',
                    'available_quantity' => $book->available_quantity
                ], 400);
            }

            // Check if user has reached borrowing limit (optional - adjust as needed)
            $userActiveBorrows = BorrowRequest::where('user_id', $borrowRequest->user_id)
                ->where('status', 'approved')
                ->whereNull('return_date')
                ->count();

            $maxBorrowLimit = 5; // You can make this configurable
            if ($userActiveBorrows >= $maxBorrowLimit) {
                return response()->json([
                    'message' => 'User has reached maximum borrowing limit',
                    'current_borrows' => $userActiveBorrows,
                    'limit' => $maxBorrowLimit
                ], 400);
            }

            // Approve the request
            $borrowRequest->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => Carbon::now(),
                'due_date' => Carbon::now()->addWeeks(2), // 2 weeks borrowing period
                'librarian_notes' => $request->input('notes', 'Request approved by librarian')
            ]);

            // Update book inventory
            $book->decrement('available_quantity');

            // Create book log entry
            BookLog::create([
                'action' => 'borrowed',
                'book_id' => $book->id,
                'user_id' => $borrowRequest->user_id,
                'librarian_id' => $request->user()->id,
                'borrow_request_id' => $borrowRequest->id,
                'notes' => 'Book approved and borrowed',
                'action_date' => Carbon::now()
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Book request approved successfully',
                'request' => [
                    'id' => $borrowRequest->id,
                    'status' => $borrowRequest->status,
                    'approved_at' => $borrowRequest->approved_at,
                    'due_date' => $borrowRequest->due_date,
                    'user' => $borrowRequest->user->name,
                    'book' => $borrowRequest->book->title,
                ],
                'book_inventory' => [
                    'title' => $book->title,
                    'available_quantity' => $book->fresh()->available_quantity,
                    'total_quantity' => $book->quantity
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error approving request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a book request
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            // Find the request
            $borrowRequest = BorrowRequest::with(['user', 'book'])->findOrFail($id);

            // Check if request is still pending
            if ($borrowRequest->status !== 'pending') {
                return response()->json([
                    'message' => 'Request has already been processed',
                    'current_status' => $borrowRequest->status
                ], 400);
            }

            // Reject the request
            $borrowRequest->update([
                'status' => 'rejected',
                'rejected_by' => $request->user()->id,
                'rejected_at' => Carbon::now(),
                'librarian_notes' => $request->input('reason')
            ]);

            // Create book log entry
            BookLog::create([
                'action' => 'request_rejected',
                'book_id' => $borrowRequest->book_id,
                'user_id' => $borrowRequest->user_id,
                'librarian_id' => $request->user()->id,
                'borrow_request_id' => $borrowRequest->id,
                'notes' => 'Request rejected: ' . $request->input('reason'),
                'action_date' => Carbon::now()
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Book request rejected successfully',
                'request' => [
                    'id' => $borrowRequest->id,
                    'status' => $borrowRequest->status,
                    'rejected_at' => $borrowRequest->rejected_at,
                    'reason' => $borrowRequest->librarian_notes,
                    'user' => $borrowRequest->user->name,
                    'book' => $borrowRequest->book->title,
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error rejecting request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current library inventory
     */
    public function inventory()
    {
        try {
            $books = Book::select([
                'id', 'title', 'author', 'isbn', 'genre',
                'quantity', 'available_quantity', 'publisher'
            ])
            ->orderBy('title')
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'isbn' => $book->isbn,
                    'genre' => $book->genre,
                    'publisher' => $book->publisher,
                    'total_quantity' => $book->quantity,
                    'available_quantity' => $book->available_quantity,
                    'borrowed_quantity' => $book->quantity - $book->available_quantity,
                    'status' => $book->available_quantity > 0 ? 'available' : 'out_of_stock'
                ];
            });

            $summary = [
                'total_books' => $books->count(),
                'available_books' => $books->where('available_quantity', '>', 0)->count(),
                'out_of_stock_books' => $books->where('available_quantity', 0)->count(),
                'total_copies' => $books->sum('total_quantity'),
                'available_copies' => $books->sum('available_quantity'),
                'borrowed_copies' => $books->sum('borrowed_quantity')
            ];

            return response()->json([
                'message' => 'Inventory retrieved successfully',
                'summary' => $summary,
                'books' => $books
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving inventory',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all requests (pending, approved, rejected) - for librarian overview
     */
    public function allRequests()
    {
        try {
            $requests = BorrowRequest::with(['user', 'book'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($request) {
                    return [
                        'id' => $request->id,
                        'request_date' => $request->created_at->format('Y-m-d H:i:s'),
                        'user' => [
                            'id' => $request->user->id,
                            'name' => $request->user->name,
                        ],
                        'book' => [
                            'id' => $request->book->id,
                            'title' => $request->book->title,
                            'author' => $request->book->author,
                        ],
                        'status' => $request->status,
                        'approved_at' => $request->approved_at?->format('Y-m-d H:i:s'),
                        'rejected_at' => $request->rejected_at?->format('Y-m-d H:i:s'),
                        'due_date' => $request->due_date?->format('Y-m-d'),
                        'return_date' => $request->return_date?->format('Y-m-d'),
                        'librarian_notes' => $request->librarian_notes
                    ];
                });

            return response()->json([
                'message' => 'All requests retrieved successfully',
                'requests' => $requests,
                'summary' => [
                    'total' => $requests->count(),
                    'pending' => $requests->where('status', 'pending')->count(),
                    'approved' => $requests->where('status', 'approved')->count(),
                    'rejected' => $requests->where('status', 'rejected')->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
