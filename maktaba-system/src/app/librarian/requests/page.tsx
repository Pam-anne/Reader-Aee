"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ChevronRight, Settings, LogOut, Search, Filter, Check, X, Calendar, BookOpen, User, Clock, AlertCircle, ChevronDown, ArrowLeft, CheckCircle, XCircle, RefreshCw, ClipboardList, XIcon } from 'lucide-react';


interface BookRequest {
  id: string;
  requestDate: string;
  reader: {
    id: string;
    name: string;
    email: string;
    currentBorrowedCount: number;
    maxBorrowLimit: number;
  };
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    availableCopies: number;
    totalCopies: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  priority: 'normal' | 'high';
  requestedDuration: number; // days
}

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

interface ConfirmationModal {
  isOpen: boolean;
  type: 'approve' | 'reject' | null;
  request: BookRequest | null;
}

const RequestsManagement: React.FC = () => {
  // Fix: Use type assertion to ensure the status values match the literal types
  const [requests, setRequests] = useState<BookRequest[]>([
    {
      id: '1',
      requestDate: '2024-01-15T10:30:00Z',
      reader: {
        id: 'r1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        currentBorrowedCount: 2,
        maxBorrowLimit: 5
      },
      book: {
        id: 'b1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        availableCopies: 3,
        totalCopies: 5
      },
      status: 'pending' as const, // Use 'as const' to preserve the literal type
      priority: 'normal' as const,
      requestedDuration: 14
    },
    {
      id: '2',
      requestDate: '2024-01-14T15:45:00Z',
      reader: {
        id: 'r2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        currentBorrowedCount: 4,
        maxBorrowLimit: 5
      },
      book: {
        id: 'b2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        availableCopies: 0,
        totalCopies: 3
      },
      status: 'pending' as const,
      priority: 'high' as const,
      requestedDuration: 21
    },
    {
      id: '3',
      requestDate: '2024-01-13T09:20:00Z',
      reader: {
        id: 'r3',
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        currentBorrowedCount: 1,
        maxBorrowLimit: 5
      },
      book: {
        id: 'b3',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        availableCopies: 2,
        totalCopies: 4
      },
      status: 'pending' as const,
      priority: 'normal' as const,
      requestedDuration: 14
    },
    {
      id: '4',
      requestDate: '2024-01-12T14:10:00Z',
      reader: {
        id: 'r4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        currentBorrowedCount: 0,
        maxBorrowLimit: 5
      },
      book: {
        id: 'b4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0-14-143951-8',
        availableCopies: 1,
        totalCopies: 2
      },
      status: 'pending' as const,
      priority: 'normal' as const,
      requestedDuration: 10
    }
  ]);

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
const [isExpanded, setIsExpanded] = useState(false);
const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    inventory: false,
    requests: true,
    profile: false,
});
const [activeItem, setActiveItem] = useState<string>('pending');

const toggleSection = (key: string) => {
    setOpenSections(prev => ({
        ...prev,
        [key]: !prev[key],
    }));
};

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmationModal>({
    isOpen: false,
    type: null,
    request: null
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = dateFilter === '' || 
      new Date(request.requestDate).toDateString() === new Date(dateFilter).toDateString();

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

    return matchesSearch && matchesDate && matchesStatus && matchesPriority;
  });

  const showToast = (type: 'success' | 'error' | 'warning', message: string): void => {
    const newToast: ToastNotification = {
      id: Date.now().toString(),
      type,
      message
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 5000);
  };

  const handleApprove = (request: BookRequest): void => {
    setConfirmModal({ isOpen: true, type: 'approve', request });
  };

  const handleReject = (request: BookRequest): void => {
    setConfirmModal({ isOpen: true, type: 'reject', request });
  };

  const confirmAction = async (): Promise<void> => {
    if (!confirmModal.request || !confirmModal.type) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedRequests = requests.map(req => 
      req.id === confirmModal.request!.id 
        ? { 
            ...req, 
            status: (confirmModal.type === 'approve' ? 'approved' : 'rejected') as 'approved' | 'rejected' 
          }
        : req
    );

    setRequests(updatedRequests);

    if (confirmModal.type === 'approve') {
      showToast('success', `Request for "${confirmModal.request.book.title}" has been approved`);
    } else {
      showToast('success', `Request for "${confirmModal.request.book.title}" has been rejected`);
    }

    setConfirmModal({ isOpen: false, type: null, request: null });
    setIsLoading(false);
  };

  const canApprove = (request: BookRequest): boolean => {
    return request.book.availableCopies > 0 && 
           request.reader.currentBorrowedCount < request.reader.maxBorrowLimit;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fix: Specify React.JSX.Element as return type instead of JSX.Element
  const getStatusBadge = (status: string): React.JSX.Element => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Fix: Specify React.JSX.Element as return type instead of JSX.Element
  const getPriorityBadge = (priority: string): React.JSX.Element => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
        priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div>
      {/* Main Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by book title, author, or reader name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setDateFilter('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reader Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(request.requestDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{request.requestedDuration} days</span>
                        </div>
                        <div className="mt-2">
                          {getPriorityBadge(request.priority)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-start space-x-3">
                          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-gray-900">{request.book.title}</h3>
                            <p className="text-sm text-gray-500">by {request.book.author}</p>
                            <p className="text-xs text-gray-400">ISBN: {request.book.isbn}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`text-sm font-medium ${
                                request.book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {request.book.availableCopies} available
                              </span>
                              <span className="text-gray-300">|</span>
                              <span className="text-sm text-gray-500">
                                {request.book.totalCopies} total
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">{request.reader.name}</h3>
                          <p className="text-sm text-gray-500">{request.reader.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-gray-600">
                              Books: {request.reader.currentBorrowedCount}/{request.reader.maxBorrowLimit}
                            </span>
                            {request.reader.currentBorrowedCount >= request.reader.maxBorrowLimit && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(request)}
                            disabled={!canApprove(request)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              canApprove(request)
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approved
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="inline-flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {confirmModal.type === 'approve' ? 'Approve Request' : 'Reject Request'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {confirmModal.type} the request for "{confirmModal.request?.book.title}" 
              by {confirmModal.request?.reader.name}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: null, request: null })}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  confirmModal.type === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{confirmModal.type === 'approve' ? 'Approve' : 'Reject'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-md ${
              toast.type === 'success' ? 'bg-green-100 text-green-800' :
              toast.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsManagement;