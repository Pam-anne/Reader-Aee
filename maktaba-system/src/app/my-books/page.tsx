'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  User,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Loader2,
  Eye,
  Download,
  MessageSquare
} from 'lucide-react';

// Define TypeScript interfaces
interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface BookRequest {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  status: 'pending' | 'approved' | 'returned' | 'rejected';
  requestDate: string;
  statusDate: string;
  estimatedAvailability?: string;
  borrowDate?: string;
  dueDate?: string;
  isOverdue?: boolean;
  returnDate?: string;
  wasOverdue?: boolean;
  rejectionReason?: string;
}

interface AuthContextType {
  user: User;
}

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<User>({
    userId: '1',
    name: 'Pamela Abaki',
    email: 'pamela@maktaba.com',
    role: 'reader'
  });

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock navigation
const useNavigate = () => {
  const router = useRouter();
  return (path: string) => {
    router.push('/dashboard');
  };
};

  // const useNavigate = (path: string) => {
  //   if (path === '/library') {
  //     router.push('/library');
  //   } 
  // };

// Generate mock user requests data
const generateMockRequests = (): BookRequest[] => {
  const books = [
    { title: 'Clean Code', author: 'Robert C. Martin' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas' },
    { title: 'Design Patterns', author: 'Gang of Four' },
    { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson' },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke' },
    { title: 'The Clean Coder', author: 'Robert C. Martin' },
    { title: 'Refactoring', author: 'Martin Fowler' },
    { title: 'Code Complete', author: 'Steve McConnell' },
    { title: 'The Mythical Man-Month', author: 'Frederick Brooks' },
    { title: 'Cracking the Coding Interview', author: 'Gayle McDowell' },
    { title: 'System Design Interview', author: 'Alex Xu' },
    { title: 'Atomic Habits', author: 'James Clear' },
    { title: 'The 7 Habits', author: 'Stephen Covey' },
    { title: 'Thinking Fast and Slow', author: 'Daniel Kahneman' }
  ];

  const requests: BookRequest[] = [];
  let id = 1;

  // Pending Requests (3 books)
  for (let i = 0; i < 3; i++) {
    const book = books[i];
    const requestDate = new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
    requests.push({
      id: id++,
      bookTitle: book.title,
      bookAuthor: book.author,
      status: 'pending',
      requestDate: requestDate.toISOString().split('T')[0],
      statusDate: requestDate.toISOString().split('T')[0],
      estimatedAvailability: new Date(Date.now() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  // Currently Borrowed (4 books)
  for (let i = 3; i < 7; i++) {
    const book = books[i];
    const borrowDate = new Date(Date.now() - Math.floor(Math.random() * 20 + 1) * 24 * 60 * 60 * 1000);
    const dueDate = new Date(borrowDate.getTime() + 21 * 24 * 60 * 60 * 1000); // 21 days from borrow
    requests.push({
      id: id++,
      bookTitle: book.title,
      bookAuthor: book.author,
      status: 'approved',
      requestDate: new Date(borrowDate.getTime() - Math.floor(Math.random() * 5 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      borrowDate: borrowDate.toISOString().split('T')[0],
      statusDate: borrowDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      isOverdue: dueDate < new Date()
    });
  }

  // Borrowing History (8 books)
  for (let i = 7; i < 15; i++) {
    const book = books[i];
    const isReturned = Math.random() > 0.2; // 80% returned, 20% rejected
    
    if (isReturned) {
      const returnDate = new Date(Date.now() - Math.floor(Math.random() * 60 + 1) * 24 * 60 * 60 * 1000);
      const borrowDate = new Date(returnDate.getTime() - Math.floor(Math.random() * 21 + 7) * 24 * 60 * 60 * 1000);
      const requestDate = new Date(borrowDate.getTime() - Math.floor(Math.random() * 5 + 1) * 24 * 60 * 60 * 1000);
      
      requests.push({
        id: id++,
        bookTitle: book.title,
        bookAuthor: book.author,
        status: 'returned',
        requestDate: requestDate.toISOString().split('T')[0],
        borrowDate: borrowDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
        statusDate: returnDate.toISOString().split('T')[0],
        wasOverdue: Math.random() > 0.8 // 20% chance it was returned late
      });
    } else {
      const rejectedDate = new Date(Date.now() - Math.floor(Math.random() * 30 + 1) * 24 * 60 * 60 * 1000);
      const requestDate = new Date(rejectedDate.getTime() - Math.floor(Math.random() * 3 + 1) * 24 * 60 * 60 * 1000);
      
      requests.push({
        id: id++,
        bookTitle: book.title,
        bookAuthor: book.author,
        status: 'rejected',
        requestDate: requestDate.toISOString().split('T')[0],
        statusDate: rejectedDate.toISOString().split('T')[0],
        rejectionReason: ['Book currently unavailable', 'Maximum borrow limit reached', 'Account restriction'][Math.floor(Math.random() * 3)]
      });
    }
  }

  return requests;
};

// Mock API function
const fetchUserRequests = async (): Promise<BookRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
  return generateMockRequests();
};

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Calculate days helper
const calculateDays = (dateString: string, fromDate: Date = new Date()): number => {
  const date = new Date(dateString);
  const diffTime = date.getTime() - fromDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Status Badge Component Props
interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'returned' | 'rejected';
  isOverdue?: boolean;
  wasOverdue?: boolean;
}

// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isOverdue = false, wasOverdue = false }) => {
  const badges = {
    pending: {
      className: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      text: 'Pending'
    },
    approved: {
      className: isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800',
      icon: isOverdue ? AlertCircle : CheckCircle,
      text: isOverdue ? 'Overdue' : 'Borrowed'
    },
    returned: {
      className: wasOverdue ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800',
      icon: CheckCircle,
      text: wasOverdue ? 'Returned Late' : 'Returned'
    },
    rejected: {
      className: 'bg-red-100 text-red-800',
      icon: XCircle,
      text: 'Rejected'
    }
  };

  const badge = badges[status] || badges.pending;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}>
      <Icon className="w-3 h-3" />
      {badge.text}
    </span>
  );
};

// Book Item Component Props
interface BookItemProps {
  request: BookRequest;
  showReturnButton?: boolean;
}

// Book Item Component
const BookItem: React.FC<BookItemProps> = ({ request, showReturnButton = false }) => {
  const handleReturnBook = () => {
    alert('Please return this book physically to a librarian at the library desk. Thank you!');
  };

  const handleViewDetails = () => {
    alert(`Viewing details for "${request.bookTitle}"`);
  };

  const getDaysInfo = () => {
    if (request.status === 'approved' && request.dueDate) {
      const daysLeft = calculateDays(request.dueDate);
      if (daysLeft < 0) {
        return { text: `${Math.abs(daysLeft)} days overdue`, className: 'text-red-600' };
      } else if (daysLeft === 0) {
        return { text: 'Due today', className: 'text-orange-600' };
      } else if (daysLeft <= 3) {
        return { text: `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`, className: 'text-yellow-600' };
      } else {
        return { text: `Due in ${daysLeft} days`, className: 'text-green-600' };
      }
    }
    return null;
  };

  const daysInfo = getDaysInfo();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Book Title and Author */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.bookTitle}</h3>
            <p className="text-gray-600">by {request.bookAuthor}</p>
          </div>

          {/* Status and Dates */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <StatusBadge 
                status={request.status} 
                isOverdue={request.isOverdue} 
                wasOverdue={request.wasOverdue} 
              />
            </div>

            {/* Date Information */}
            <div className="text-sm text-gray-600 space-y-1">
              {request.status === 'pending' && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Requested on: {formatDate(request.requestDate)}</span>
                  </div>
                  {request.estimatedAvailability && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Estimated availability: {formatDate(request.estimatedAvailability)}</span>
                    </div>
                  )}
                </>
              )}

              {request.status === 'approved' && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Borrowed on: {formatDate(request.borrowDate!)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Due: {formatDate(request.dueDate!)}</span>
                    {daysInfo && (
                      <span className={`font-medium ${daysInfo.className}`}>
                        ({daysInfo.text})
                      </span>
                    )}
                  </div>
                </>
              )}

              {request.status === 'returned' && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Borrowed: {formatDate(request.borrowDate!)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Returned on: {formatDate(request.returnDate!)}</span>
                  </div>
                </>
              )}

              {request.status === 'rejected' && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Requested on: {formatDate(request.requestDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>Rejected on: {formatDate(request.statusDate)}</span>
                  </div>
                  {request.rejectionReason && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-red-600">Reason: {request.rejectionReason}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>

          {showReturnButton && request.status === 'approved' && (
            <button
              onClick={handleReturnBook}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Return Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const BookItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="ml-4">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

// Main MyBooks Component
const MyBooks: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('borrowed'); // Default to currently borrowed

  // Filter requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const currentlyBorrowed = requests.filter(req => req.status === 'approved');
  const borrowingHistory = requests.filter(req => req.status === 'returned' || req.status === 'rejected');

  // Fetch user requests on component mount
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const requestsData = await fetchUserRequests();
        setRequests(requestsData);
      } catch (err) {
        setError('Failed to load your books. Please try again.');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const tabs = [
    {
      id: 'borrowed',
      name: 'Currently Borrowed',
      count: currentlyBorrowed.length,
      data: currentlyBorrowed,
      icon: BookOpen,
      color: 'text-green-600 border-green-600'
    },
    {
      id: 'pending',
      name: 'Pending Requests',
      count: pendingRequests.length,
      data: pendingRequests,
      icon: Clock,
      color: 'text-yellow-600 border-yellow-600'
    },
    {
      id: 'history',
      name: 'Borrowing History',
      count: borrowingHistory.length,
      data: borrowingHistory,
      icon: CheckCircle,
      color: 'text-blue-600 border-blue-600'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">My Books</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Library Activity</h2>
          <p className="text-gray-600">Manage your book requests and borrowing history</p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? `${tab.color} border-current`
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      isActive 
                        ? 'bg-current bg-opacity-10' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <BookItemSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              {activeTabData && activeTabData.data.length > 0 ? (
                <div className="space-y-4">
                  {activeTabData.data.map((request) => (
                    <BookItem 
                      key={request.id} 
                      request={request}
                      showReturnButton={activeTab === 'borrowed'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className={`w-16 h-16 mx-auto mb-4 ${activeTabData?.color.split(' ')[0]} opacity-50`}>
                    {activeTabData?.icon && (
                      <activeTabData.icon className="w-16 h-16" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTabData?.name.toLowerCase()} found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'pending' && "You don't have any pending book requests."}
                    {activeTab === 'borrowed' && "You don't have any books currently borrowed."}
                    {activeTab === 'history' && "You haven't borrowed any books yet."}
                  </p>
                  {activeTab !== 'history' && (
                    <button
                      onClick={() => navigate('/library')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Browse the library catalog
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Statistics */}
        {!loading && requests.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentlyBorrowed.length}</p>
                  <p className="text-sm text-gray-600">Currently Borrowed</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {borrowingHistory.filter(r => r.status === 'returned').length}
                  </p>
                  <p className="text-sm text-gray-600">Books Returned</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <MyBooks />
    </AuthProvider>
  );
};

export default App;