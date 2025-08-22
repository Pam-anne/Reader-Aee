<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'publisher',
        'published_year',
        'genre',
        'cover_image_url',
        'status',
        'pages',
        'borrowing_limit',
        'summary',
    ];

    protected $casts = [
        'published_year' => 'integer',
        'pages' => 'integer',
        'borrowing_limit' => 'integer',
    ];

    public function borrowRequests()
    {
        return $this->hasMany(BorrowRequest::class);
    }

    public function activeBorrowRequest()
    {
        return $this->hasOne(BorrowRequest::class)->whereIn('status', ['approved']);
    }
}
