<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Book;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Reader user
        User::create([
            'name' => 'Aee',
            'email' => 'aee@example.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]);

        // Create 20 sample books
        $books = [
            ['title' => 'The Great Gatsby', 'author' => 'F. Scott Fitzgerald', 'isbn' => '9780743273565', 'publisher' => 'Scribner', 'published_year' => 1925, 'genre' => 'Fiction', 'pages' => 180, 'summary' => 'A classic American novel about the Jazz Age.'],
            ['title' => 'To Kill a Mockingbird', 'author' => 'Harper Lee', 'isbn' => '9780061120084', 'publisher' => 'J.B. Lippincott & Co.', 'published_year' => 1960, 'genre' => 'Fiction', 'pages' => 376, 'summary' => 'A story of racial injustice and childhood innocence.'],
            ['title' => '1984', 'author' => 'George Orwell', 'isbn' => '9780451524935', 'publisher' => 'Secker & Warburg', 'published_year' => 1949, 'genre' => 'Dystopian Fiction', 'pages' => 328, 'summary' => 'A dystopian social science fiction novel.'],
            ['title' => 'Pride and Prejudice', 'author' => 'Jane Austen', 'isbn' => '9780141439518', 'publisher' => 'T. Egerton', 'published_year' => 1923, 'genre' => 'Romance', 'pages' => 432, 'summary' => 'A romantic novel of manners.'],
            ['title' => 'The Catcher in the Rye', 'author' => 'J.D. Salinger', 'isbn' => '9780316769174', 'publisher' => 'Little, Brown and Company', 'published_year' => 1951, 'genre' => 'Fiction', 'pages' => 277, 'summary' => 'A controversial coming-of-age story.'],
            ['title' => 'Animal Farm', 'author' => 'George Orwell', 'isbn' => '9780452284241', 'publisher' => 'Secker & Warburg', 'published_year' => 1945, 'genre' => 'Political Satire', 'pages' => 112, 'summary' => 'An allegorical novella about farm animals.'],
            ['title' => 'Lord of the Flies', 'author' => 'William Golding', 'isbn' => '9780571056866', 'publisher' => 'Faber & Faber', 'published_year' => 1954, 'genre' => 'Adventure Fiction', 'pages' => 224, 'summary' => 'A story of British boys stranded on an island.'],
            ['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien', 'isbn' => '9780547928227', 'publisher' => 'George Allen & Unwin', 'published_year' => 1937, 'genre' => 'Fantasy', 'pages' => 310, 'summary' => 'A fantasy adventure about a hobbit named Bilbo.'],
            ['title' => 'Fahrenheit 451', 'author' => 'Ray Bradbury', 'isbn' => '9781451673319', 'publisher' => 'Ballantine Books', 'published_year' => 1953, 'genre' => 'Science Fiction', 'pages' => 256, 'summary' => 'A dystopian novel about censorship.'],
            ['title' => 'Jane Eyre', 'author' => 'Charlotte Brontë', 'isbn' => '9780141441146', 'publisher' => 'Smith, Elder & Co.', 'published_year' => 1947, 'genre' => 'Gothic Fiction', 'pages' => 507, 'summary' => 'A bildungsroman following orphan Jane Eyre.'],
            ['title' => 'Wuthering Heights', 'author' => 'Emily Brontë', 'isbn' => '9780141439556', 'publisher' => 'Thomas Cautley Newby', 'published_year' => 1947, 'genre' => 'Gothic Fiction', 'pages' => 464, 'summary' => 'A tale of passion and revenge.'],
            ['title' => 'The Lord of the Rings', 'author' => 'J.R.R. Tolkien', 'isbn' => '9780544003415', 'publisher' => 'George Allen & Unwin', 'published_year' => 1954, 'genre' => 'Fantasy', 'pages' => 1216, 'summary' => 'An epic high fantasy adventure.'],
            ['title' => 'Brave New World', 'author' => 'Aldous Huxley', 'isbn' => '9780060850524', 'publisher' => 'Chatto & Windus', 'published_year' => 1932, 'genre' => 'Science Fiction', 'pages' => 288, 'summary' => 'A dystopian novel set in a futuristic society.'],
            ['title' => 'The Chronicles of Narnia', 'author' => 'C.S. Lewis', 'isbn' => '9780066238500', 'publisher' => 'Geoffrey Bles', 'published_year' => 1950, 'genre' => 'Fantasy', 'pages' => 767, 'summary' => 'A series of seven fantasy novels.'],
            ['title' => 'One Hundred Years of Solitude', 'author' => 'Gabriel García Márquez', 'isbn' => '9780060883287', 'publisher' => 'Harper & Row', 'published_year' => 1967, 'genre' => 'Magical Realism', 'pages' => 417, 'summary' => 'A landmark work of magical realism.'],
            ['title' => 'The Kite Runner', 'author' => 'Khaled Hosseini', 'isbn' => '9781594631931', 'publisher' => 'Riverhead Books', 'published_year' => 2003, 'genre' => 'Historical Fiction', 'pages' => 371, 'summary' => 'A story of friendship and redemption in Afghanistan.'],
            ['title' => 'The Da Vinci Code', 'author' => 'Dan Brown', 'isbn' => '9780307474278', 'publisher' => 'Doubleday', 'published_year' => 2003, 'genre' => 'Mystery Thriller', 'pages' => 689, 'summary' => 'A mystery thriller involving religious history.'],
            ['title' => 'The Alchemist', 'author' => 'Paulo Coelho', 'isbn' => '9780062315007', 'publisher' => 'HarperOne', 'published_year' => 1988, 'genre' => 'Adventure Fiction', 'pages' => 163, 'summary' => 'A philosophical story about following your dreams.'],
            ['title' => 'Life of Pi', 'author' => 'Yann Martel', 'isbn' => '9780156027321', 'publisher' => 'Knopf Canada', 'published_year' => 2001, 'genre' => 'Adventure Fiction', 'pages' => 460, 'summary' => 'A survival story with a philosophical twist.'],
            ['title' => 'The Book Thief', 'author' => 'Markus Zusak', 'isbn' => '9780375842207', 'publisher' => 'Knopf Books', 'published_year' => 2005, 'genre' => 'Historical Fiction', 'pages' => 552, 'summary' => 'A story narrated by Death during WWII.'],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
