// src/app/bookcatalog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, BookOpen, Clock, User, AlertCircle, Loader2, ChevronDown, ChevronUp, Star } from 'lucide-react';

// Define TypeScript interfaces
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  published_year: number;
  isbn: string;
  pages: number;
  rating: string;
  isAvailable: boolean;
  description: string;
  coverColor: string;
  borrowedBy: string | null;
  dueDate: string | null;
  status:string
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  borrowedBooks: string[];
}

// Complete mock data for 50 books with your original styling


export default function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  
  const router = useRouter();

  // Mock user data
  const mockUser: UserData = {
    id: '1',
    name: 'Pamela Abaki',
    email: 'pamela@maktaba.com',
    role: 'reader',
    borrowedBooks: ['2', '5', '8', '12']
  };

  const user: UserData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : mockUser;
  console.log('Current user:', user);

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/books/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Fetched books:', data.data);
        setBooks(data.data);
        setFilteredBooks(data.data);
      } catch (err) {
        setError('Failed to load books. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Filter and sort books
  useEffect(() => {
    let result = [...books];

    // Search filter
    if (searchTerm) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      result = result.filter(book => book.genre === selectedGenre);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      const available = availabilityFilter === 'available';
      result = result.filter(book => book.status === (available ? 'available' : 'unavailable'));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'author') {
        return sortOrder === 'asc'
          ? a.author.localeCompare(b.author)
          : b.author.localeCompare(a.author);
      } else if (sortBy === 'year') {
        return sortOrder === 'asc'
          ? a.published_year - b.published_year
          : b.published_year - a.published_year;
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc'
          ? parseFloat(a.rating) - parseFloat(b.rating)
          : parseFloat(b.rating) - parseFloat(a.rating);
      }
      return 0;
    });

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, availabilityFilter, sortBy, sortOrder, books]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  const handleBorrowRequest = async (bookId: number) => {
    const token = localStorage.getItem('token');
    const borrowedAt = new Date().toISOString();

    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          book_id: bookId,
          borrowed_at: borrowedAt,
          due_date: dueDate.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to borrow book');
      }

      const data = await response.json();

     
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === bookId ? { ...book, status: 'pending' } : book
        )
      );

      alert(`Borrow request submitted for "${data.book.title}". Status: ${data.status}`);
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Something went wrong. Please try again.');
    }
  };



  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const genres = [...new Set(books.map(book => book.genre))];
  console.log('Available genres:', genres);
  const availabilityOptions = ['all', 'available', 'unavailable'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading library catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Maktaba Library Catalog</h1>
            </div>
            <div className="flex items-center gap-4">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500"
            />
          </div>

          {/* Filters and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Books' : option === 'available' ? 'Available' : 'Unavailable'}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentBooks.length} of {filteredBooks.length} books
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBooks.map(book => (
            <div key={book.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
              {/* Book Cover */}
              <div className={`h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative`}>
                <BookOpen className="w-16 h-16 text-white opacity-90" />
                {book.status === 'unavailable' && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Borrowed
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 mb-3">by {book.author}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{book.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                {/* Book Details */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                  <div>Year: {book.published_year}</div>
                  <div>Pages: {book.pages}</div>
                  <div>Publisher: {book.publisher}</div>
                  <div>ISBN: {book.isbn}</div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBorrowRequest(book.id)}
                  disabled={book.status !== 'available'}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${book.status === 'available'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {book.status === 'available'
                    ? 'Borrow'
                    : book.status === 'pending'
                      ? 'Pending Approval'
                      : 'Already Borrowed'}
                </button>


                {book.dueDate && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-500">
                    <Clock className="w-4 h-4" />
                    <span>Due: {book.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
                setAvailabilityFilter('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}