// src/app/bookcatalog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, BookOpen, Clock, User, AlertCircle, Loader2, ChevronDown, ChevronUp, Star } from 'lucide-react';

// Define TypeScript interfaces
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publishedYear: number;
  isbn: string;
  pages: number;
  rating: string;
  isAvailable: boolean;
  description: string;
  coverColor: string;
  borrowedBy: string | null;
  dueDate: string | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  borrowedBooks: string[];
}

// Complete mock data for 50 books with your original styling
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    publisher: 'Scribner',
    publishedYear: 1925,
    isbn: '978-0-7432-7356-5',
    pages: 180,
    rating: '4.5',
    isAvailable: true,
    description: 'A classic novel about the American Dream in the Jazz Age',
    coverColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    publisher: 'J.B. Lippincott & Co.',
    publishedYear: 1960,
    isbn: '978-0-06-112008-4',
    pages: 281,
    rating: '4.8',
    isAvailable: false,
    description: 'A story about racial inequality and moral growth in the American South',
    coverColor: 'bg-gradient-to-br from-green-400 to-green-600',
    borrowedBy: 'John Doe',
    dueDate: '2024-01-15'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Fiction',
    publisher: 'Secker & Warburg',
    publishedYear: 1949,
    isbn: '978-0-452-28423-4',
    pages: 328,
    rating: '4.7',
    isAvailable: true,
    description: 'A dystopian social science fiction novel about totalitarian control',
    coverColor: 'bg-gradient-to-br from-red-400 to-red-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Fiction',
    publisher: 'T. Egerton',
    publishedYear: 1813,
    isbn: '978-0-14-143951-8',
    pages: 432,
    rating: '4.6',
    isAvailable: true,
    description: 'A romantic novel of manners that depicts the emotional development',
    coverColor: 'bg-gradient-to-br from-pink-400 to-pink-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    publisher: 'Little, Brown and Company',
    publishedYear: 1951,
    isbn: '978-0-316-76948-0',
    pages: 234,
    rating: '4.3',
    isAvailable: false,
    description: 'A story about teenage rebellion and alienation in New York City',
    coverColor: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    borrowedBy: 'Sarah Smith',
    dueDate: '2024-01-18'
  },
  {
    id: '6',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    publisher: 'Allen & Unwin',
    publishedYear: 1954,
    isbn: '978-0-618-64015-7',
    pages: 1178,
    rating: '4.9',
    isAvailable: true,
    description: 'An epic high fantasy adventure set in Middle-earth',
    coverColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '7',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    publisher: 'Bloomsbury',
    publishedYear: 1997,
    isbn: '978-0-7475-3269-6',
    pages: 223,
    rating: '4.8',
    isAvailable: true,
    description: 'The first novel in the Harry Potter series',
    coverColor: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '8',
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    publisher: 'Doubleday',
    publishedYear: 2003,
    isbn: '978-0-385-50420-5',
    pages: 454,
    rating: '4.2',
    isAvailable: false,
    description: 'A mystery thriller novel about a conspiracy within the Catholic Church',
    coverColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
    borrowedBy: 'Mike Johnson',
    dueDate: '2024-01-20'
  },
  {
    id: '9',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    publisher: 'HarperCollins',
    publishedYear: 1988,
    isbn: '978-0-06-231500 7',
    pages: 208,
    rating: '4.5',
    isAvailable: true,
    description: 'A philosophical novel about following your dreams',
    coverColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '10',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Science Fiction',
    publisher: 'Scholastic',
    publishedYear: 2008,
    isbn: '978-0-439-02352-8',
    pages: 374,
    rating: '4.7',
    isAvailable: true,
    description: 'A dystopian novel set in a post-apocalyptic nation',
    coverColor: 'bg-gradient-to-br from-red-500 to-red-700',
    borrowedBy: null,
    dueDate: null
  },
  // Add 40 more books to reach 50...
  {
    id: '11',
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    publisher: 'Doubleday',
    publishedYear: 1977,
    isbn: '978-0-385-12167-5',
    pages: 447,
    rating: '4.6',
    isAvailable: true,
    description: 'A horror novel about a family\'s winter in an isolated hotel',
    coverColor: 'bg-gradient-to-br from-red-600 to-red-800',
    borrowedBy: null,
    dueDate: null
  },
  {
    id: '12',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    publisher: 'Allen & Unwin',
    publishedYear: 1937,
    isbn: '978-0-618-64015-7',
    pages: 310,
    rating: '4.8',
    isAvailable: false,
    description: 'A fantasy novel about Bilbo Baggins\' adventure',
    coverColor: 'bg-gradient-to-br from-green-500 to-green-700',
    borrowedBy: 'Emma Wilson',
    dueDate: '2024-01-22'
  },
  // Continue adding more books to reach 50...
];

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

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBooks(mockBooks);
        setFilteredBooks(mockBooks);
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
      result = result.filter(book => book.isAvailable === available);
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
          ? a.publishedYear - b.publishedYear
          : b.publishedYear - a.publishedYear;
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

  const handleBorrowRequest = async (bookId: string) => {
    try {
      if (mockUser.borrowedBooks.includes(bookId)) {
        alert('You have already borrowed this book.');
        return;
      }

      if (mockUser.borrowedBooks.length >= 5) {
        alert('You have reached your borrowing limit of 5 books.');
        return;
      }

      // Simulate API call
      alert(`Book requested successfully! Book ID: ${bookId}`);
      
    } catch (err) {
      alert('Failed to request book. Please try again.');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const genres = ['all', 'Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 'Horror', 'Romance'];
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
              <span className="text-sm text-gray-600">Welcome, {mockUser.name}</span>
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
              <div className={`h-48 ${book.coverColor} flex items-center justify-center relative`}>
                <BookOpen className="w-16 h-16 text-white opacity-90" />
                {!book.isAvailable && (
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
                  <div>Year: {book.publishedYear}</div>
                  <div>Pages: {book.pages}</div>
                  <div>Publisher: {book.publisher}</div>
                  <div>ISBN: {book.isbn}</div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBorrowRequest(book.id)}
                  disabled={!book.isAvailable || mockUser.borrowedBooks.includes(book.id)}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    book.isAvailable && !mockUser.borrowedBooks.includes(book.id)
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {mockUser.borrowedBooks.includes(book.id)
                    ? 'Already Borrowed'
                    : book.isAvailable
                    ? 'Borrow Book'
                    : 'Unavailable'
                  }
                </button>
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