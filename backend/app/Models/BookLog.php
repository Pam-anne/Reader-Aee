<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'book_id',
        'user_id',
        'librarian_id',
        'borrow_request_id',
        'notes',
        'action_date'
    ];

    protected $casts = [
        'action_date' => 'datetime',
    ];

    // Relationships
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function librarian()
    {
        return $this->belongsTo(User::class, 'librarian_id');
    }

    public function borrowRequest()
    {
        return $this->belongsTo(BorrowRequest::class);
    }
}
