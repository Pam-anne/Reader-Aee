"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Clock, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Bell, 
  Settings, 
  Search,
  Plus,
  ChevronRight,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import router from 'next/dist/shared/lib/router/router';

interface DashboardStats {
  pendingRequests: number;
  overdueBooks: number;
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  activeMembers: number;
  todayReturns: number;
  newRequestsToday: number;
}

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

interface RecentActivity {
  id: string;
  type: 'request' | 'return' | 'overdue';
  user: string;
  book: string;
  time: string;
  status: 'pending' | 'approved' | 'returned' | 'overdue';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  count, 
  icon, 
  href, 
  color, 
  trend, 
  onClick 
}) => (
  <div 
    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
    
    <div className="mb-2">
      <h3 className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
    
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span>View details</span>
      <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

const LibrarianDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pendingRequests: 23,
    overdueBooks: 5,
    totalBooks: 2847,
    availableBooks: 1563,
    borrowedBooks: 1284,
    activeMembers: 456,
    todayReturns: 12,
    newRequestsToday: 8
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    { id: '1', type: 'request', user: 'John Doe', book: 'The Great Gatsby', time: '5 min ago', status: 'pending' },
    { id: '2', type: 'return', user: 'Jane Smith', book: 'To Kill a Mockingbird', time: '15 min ago', status: 'returned' },
    { id: '3', type: 'overdue', user: 'Mike Johnson', book: '1984', time: '1 hour ago', status: 'overdue' },
    { id: '4', type: 'request', user: 'Sarah Wilson', book: 'Pride and Prejudice', time: '2 hours ago', status: 'approved' }
  ]);

  const [notifications, setNotifications] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update pending requests (simulate new requests)
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          pendingRequests: prev.pendingRequests + 1,
          newRequestsToday: prev.newRequestsToday + 1
        }));
        setNotifications(prev => prev + 1);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = (): void => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        pendingRequests: Math.max(0, prev.pendingRequests + Math.floor(Math.random() * 3) - 1),
        overdueBooks: Math.max(0, prev.overdueBooks + Math.floor(Math.random() * 2) - 1)
      }));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCardClick = (href: string): void => {
    router.push('/librarian/requests');
    if (href === '/librarian/requests') {
        router.push(href);
    } else {
        router.push('/librarian/inventory');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Librarian Dashboard</h1>
                <p className="text-blue-100">Welcome back, manage your library efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <Bell className="w-6 h-6 cursor-pointer hover:text-blue-200" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              
              <Settings className="w-6 h-6 cursor-pointer hover:text-blue-200" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Pending Requests" 
            count={stats.pendingRequests} 
            icon={<Clock className="w-8 h-8" />}
            href="/librarian/requests"
            color="bg-yellow-100 text-yellow-800"
            trend={{ value: 12, isPositive: true }}
            onClick={() => handleCardClick('/librarian/requests')}
          />
          
          <DashboardCard 
            title="Overdue Books" 
            count={stats.overdueBooks} 
            icon={<AlertCircle className="w-8 h-8" />}
            href="/librarian/overdue"
            color="bg-red-100 text-red-800"
            trend={{ value: 5, isPositive: false }}
            onClick={() => handleCardClick('/librarian/overdue')}
          />
          
          <DashboardCard 
            title="Available Books" 
            count={stats.availableBooks} 
            icon={<BookOpen className="w-8 h-8" />}
            href="/librarian/inventory"
            color="bg-green-100 text-green-800"
            trend={{ value: 3, isPositive: true }}
            onClick={() => handleCardClick('/librarian/inventory')}
          />
          
          <DashboardCard 
            title="Active Members" 
            count={stats.activeMembers} 
            icon={<Users className="w-8 h-8" />}
            href="/librarian/members"
            color="bg-blue-100 text-blue-800"
            trend={{ value: 8, isPositive: true }}
            onClick={() => handleCardClick('/librarian/members')}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Borrowed Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.borrowedBooks.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Returns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayReturns}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Requests Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newRequestsToday}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleCardClick('/librarian/requests')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Requests</h3>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-4">Review and approve pending book requests from readers</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View Requests
            </button>
          </div>

          <div 
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleCardClick('/librarian/inventory')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventory Management</h3>
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600 mb-4">Add, edit, and manage your book collection</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Manage Inventory
            </button>
          </div>

          {/* <div 
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleCardClick('/librarian/add-book')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Book</h3>
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-4">Add new books to your library collection</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Add Book
            </button>
          </div> */}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'request' ? 'bg-yellow-100' : 
                      activity.type === 'return' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {activity.type === 'request' && <Clock className="w-5 h-5 text-yellow-600" />}
                      {activity.type === 'return' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.type === 'overdue' && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.book}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                      activity.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;