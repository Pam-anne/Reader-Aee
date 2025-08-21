<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookController extends Controller
{
  public function index()
    {
        // Show only books that are available
        $books = Book::where('quantity', '>', 0)->paginate(10);

        return view('reader.books.index', compact('books'));
    }
}
    //

