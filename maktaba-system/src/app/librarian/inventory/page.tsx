"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Edit,
  Trash2,
  AlertCircle,
  BookOpen,
  Copy,
  CheckCircle,
  XCircle,
  User, 
  Settings, 
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Sidebar Navigation Component
const LibrarianSidebar: React.FC<{ 
  activeItem: string;
  setActiveItem: (item: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}> = ({ activeItem, setActiveItem, isExpanded, setIsExpanded }) => {
  const [openSections, setOpenSections] = useState({
    inventory: true,
    requests: true,
    profile: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const navigationItems = {
    inventory: {
      title: 'Inventory',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { id: 'all-books', label: 'All Books' },
        { id: 'add-book', label: 'Add New Book' },
        { id: 'low-stock', label: 'Low Stock Alerts' },
        { id: 'damaged-books', label: 'Damaged Books' }
      ]
    },
    requests: {
      title: 'Requests',
      icon: <ClipboardList className="w-5 h-5" />,
      items: [
        { id: 'pending', label: 'Pending Requests' },
        { id: 'approved', label: 'Approved Requests' },
        { id: 'rejected', label: 'Rejected Requests' },
        { id: 'borrowing-history', label: 'Borrowing History' }
      ]
    },
    profile: {
      title: 'Profile & Settings',
      icon: <User className="w-5 h-5" />,
      items: [
        { id: 'profile', label: 'My Profile' }
      ]
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${isExpanded ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Maktaba Library</span>
            </div>
          </div>

          {/* User profile summary */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="font-semibold">L</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Librarian User</p>
                <p className="text-xs text-gray-400 truncate">librarian@maktaba.com</p>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {Object.entries(navigationItems).map(([key, section]) => (
              <div key={key} className="mb-2">
                <button
                  onClick={() => toggleSection(key)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                  {openSections[key as keyof typeof openSections] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {openSections[key as keyof typeof openSections] && (
                  <div className="ml-4 pl-8 border-l border-gray-700">
                    {section.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${
                          activeItem === item.id
                            ? 'text-blue-400 bg-gray-800'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer with logout */}
          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
              <Settings className="w-5 h-5" />
              <span>System Settings</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Librarian Layout Component
const LibrarianLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('all-books');

  return (
    <div className="flex h-screen bg-gray-100">
      <LibrarianSidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <main className="flex-1 overflow-y-auto lg:ml-0 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  status: 'available' | 'damaged' | 'lost';
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    available: 'bg-green-100 text-green-800',
    damaged: 'bg-yellow-100 text-yellow-800',
    lost: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status}
    </span>
  );
};

// Main Inventory Component
const InventoryManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newCopies, setNewCopies] = useState<number>(0);

  // Load mock data
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBooks: Book[] = [
      { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', publishedYear: 1925, genre: 'Fiction', totalCopies: 5, availableCopies: 3, status: 'available' },
      { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', publishedYear: 1960, genre: 'Fiction', totalCopies: 4, availableCopies: 2, status: 'available' },
      { id: '3', title: '1984', author: 'George Orwell', isbn: '9780451524935', publishedYear: 1949, genre: 'Dystopian', totalCopies: 6, availableCopies: 4, status: 'available' },
      { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', publishedYear: 1813, genre: 'Romance', totalCopies: 3, availableCopies: 1, status: 'available' },
      { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', publishedYear: 1937, genre: 'Fantasy', totalCopies: 5, availableCopies: 0, status: 'available' },
      { id: '6', title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', isbn: '9780747532743', publishedYear: 1997, genre: 'Fantasy', totalCopies: 7, availableCopies: 5, status: 'available' },
      { id: '7', title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769174', publishedYear: 1951, genre: 'Fiction', totalCopies: 4, availableCopies: 2, status: 'damaged' },
      { id: '8', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '9780544003415', publishedYear: 1954, genre: 'Fantasy', totalCopies: 6, availableCopies: 3, status: 'available' },
      { id: '9', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780062315007', publishedYear: 1988, genre: 'Fiction', totalCopies: 5, availableCopies: 4, status: 'available' },
      { id: '10', title: 'The Da Vinci Code', author: 'Dan Brown', isbn: '9780307474278', publishedYear: 2003, genre: 'Mystery', totalCopies: 5, availableCopies: 0, status: 'lost' },
    ];
    
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = books;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(book => book.status === statusFilter);
    }
    
    // Apply availability filter
    if (availabilityFilter !== 'all') {
      if (availabilityFilter === 'available') {
        result = result.filter(book => book.availableCopies > 0);
      } else if (availabilityFilter === 'unavailable') {
        result = result.filter(book => book.availableCopies === 0);
      }
    }
    
    setFilteredBooks(result);
  }, [books, searchQuery, statusFilter, availabilityFilter]);

  // Handle edit book
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setNewCopies(book.totalCopies);
    setShowEditModal(true);
  };

  // Handle update copies
  const handleUpdateCopies = () => {
    if (!editingBook) return;
    
    const updatedBooks = books.map(book => 
      book.id === editingBook.id 
        ? { 
            ...book, 
            totalCopies: newCopies,
            availableCopies: Math.max(0, book.availableCopies + (newCopies - book.totalCopies))
          } 
        : book
    );
    
    setBooks(updatedBooks);
    setShowEditModal(false);
    setEditingBook(null);
  };

  // Handle mark as damaged/lost/available
  const handleMarkStatus = (bookId: string, status: 'damaged' | 'lost' | 'available') => {
    const updatedBooks = books.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            status,
            availableCopies: book.availableCopies
          } 
        : book
    );
    
    setBooks(updatedBooks);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Published Year', 'Genre', 'Total Copies', 'Available Copies', 'Status'];
    const csvData = filteredBooks.map(book => [
      book.title,
      book.author,
      book.isbn,
      book.publishedYear,
      book.genre,
      book.totalCopies,
      book.availableCopies,
      book.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'library_inventory.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <LibrarianLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600">Manage book stock and view availability</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center">
                  <Filter className="text-gray-400 w-5 h-5 mr-2" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="damaged">Damaged</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available Copies</option>
                  <option value="unavailable">No Available Copies</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Copies</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {books.reduce((sum, book) => sum + book.availableCopies, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issues (Damaged/Lost)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {books.filter(book => book.status === 'damaged' || book.status === 'lost').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title & Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ISBN
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Copies
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.author}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.isbn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.genre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{book.availableCopies}</span> of <span className="font-medium">{book.totalCopies}</span> available
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={book.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit copies"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {book.status === 'available' && (
                            <>
                              <button
                                onClick={() => handleMarkStatus(book.id, 'damaged')}
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Mark as damaged"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMarkStatus(book.id, 'lost')}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Mark as lost"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {(book.status === 'damaged' || book.status === 'lost') && (
                            <button
                              onClick={() => handleMarkStatus(book.id, 'available')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Mark as available"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">No books found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Copies Modal */}
        {showEditModal && editingBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Update Copies for {editingBook.title}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Total Copies: {editingBook.totalCopies}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Copies: {editingBook.availableCopies}
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Total Copies
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newCopies}
                  onChange={(e) => setNewCopies(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Setting this to {editingBook.totalCopies > newCopies ? 'less' : 'more'} than the current total will {editingBook.totalCopies > newCopies ? 'decrease' : 'increase'} available copies accordingly.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCopies}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Copies
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LibrarianLayout>
  );
};

export default InventoryManagement;