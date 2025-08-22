<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('author')) {
            $query->where('author', 'like', '%' . $request->author . '%');
        }

        if ($request->has('genre')) {
            $query->where('genre', 'like', '%' . $request->genre . '%');
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $books = $query->paginate(10);

        return response()->json($books);
    }
}
