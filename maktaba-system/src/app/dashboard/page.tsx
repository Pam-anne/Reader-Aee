// src/app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  LogOut, 
  User, 
  BookText,
  Library,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Pamela Abaki',
  email: 'pamela@maktaba.com',
  role: 'reader' as const,
  borrowLimit: 5,
  currentlyBorrowed: [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', dueDate: '2024-01-15' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', dueDate: '2024-01-20' }
  ],
  pendingRequests: [
    { id: '3', title: '1984', author: 'George Orwell', requestDate: '2024-01-10' }
  ]
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'borrowed' | 'pending'>('borrowed');
  const [currentPage, setCurrentPage] = useState(0);

  const router = useRouter();

  // Pagination setup
  const books = activeTab === 'borrowed' ? mockUser.currentlyBorrowed : mockUser.pendingRequests;
  const pageSize = 2;
  const totalPages = Math.ceil(books.length / pageSize);
  const paginatedBooks = books.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    alert('Logout successful! Redirecting to login...');
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    if (path === '/library') {
      router.push('/library');
    } else if (path === '/my-books') {
      router.push('/my-books');
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Maktaba Digital</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Welcome, {mockUser.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reader Dashboard</h2>
            <p className="text-lg text-gray-600">Manage your book borrowing and requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <BookText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-900 mb-1">{mockUser.borrowLimit}</h3>
              <p className="text-sm text-blue-700">Borrowing Limit</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-900 mb-1">{mockUser.currentlyBorrowed.length}</h3>
              <p className="text-sm text-green-700">Currently Borrowed</p>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 text-center">
              <BookText className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-900 mb-1">{mockUser.pendingRequests.length}</h3>
              <p className="text-sm text-yellow-700">Pending Requests</p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-purple-900 mb-1">12</h3>
              <p className="text-sm text-purple-700">Reading History</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleNavigation('/library')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Library className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Browse Library</h3>
                  <p className="text-blue-100">Discover and borrow new books</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/my-books')}
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">View My Books</h3>
                  <p className="text-green-100">Manage your borrowed books</p>
                </div>
              </div>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('borrowed'); setCurrentPage(0); }}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'borrowed'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Currently Borrowed ({mockUser.currentlyBorrowed.length})
            </button>
            <button
              onClick={() => { setActiveTab('pending'); setCurrentPage(0); }}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Requests ({mockUser.pendingRequests.length})
            </button>
          </div>

          {/* Books List */}
          <div className="space-y-3">
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book) => (
                <div key={book.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <h4 className="font-semibold text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                  {'dueDate' in book && (
                    <p className="text-xs text-gray-500 mt-2">
                      Due: {formatDate(book.dueDate)}
                    </p>
                  )}
                  {'requestDate' in book && (
                    <p className="text-xs text-gray-500 mt-2">
                      Requested: {formatDate(book.requestDate)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No {activeTab} books</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Development Note */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Development Note:</strong> This is a mock dashboard using sample data. 
              Backend integration will be implemented when the API is ready.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}