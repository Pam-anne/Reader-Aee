"use client";

import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  AlertCircle, 
  TrendingUp, 
  DollarSign,
  Server,
  Calendar,
  BarChart3,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';

// Types
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

interface OverdueBook {
  id: string;
  title: string;
  borrower: string;
  dueDate: string;
  daysOverdue: number;
}

interface PopularBook {
  id: string;
  title: string;
  author: string;
  borrowCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface SystemStatus {
  database: 'online' | 'offline';
  api: 'online' | 'offline';
  storage: 'online' | 'offline';
  lastChecked: string;
}

// Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && (
          <div className={`flex items-center mt-1 text-sm ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.positive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

// Overdue Book Item Component
const OverdueBookItem: React.FC<{ book: OverdueBook }> = ({ book }) => (
  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
    <div className="flex-1">
      <h4 className="font-medium text-sm text-gray-900">{book.title}</h4>
      <p className="text-xs text-gray-600">Borrower: {book.borrower}</p>
    </div>
    <div className="text-right">
      <span className="text-sm font-medium text-red-600">{book.daysOverdue} days overdue</span>
      <p className="text-xs text-gray-500">Due: {book.dueDate}</p>
    </div>
  </div>
);

// Popular Book Item Component
const PopularBookItem: React.FC<{ book: PopularBook; rank: number }> = ({ book, rank }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-2 border border-gray-200">
    <div className="flex items-center">
      <span className="text-sm font-medium text-gray-600 w-6">{rank}.</span>
      <div className="ml-2">
        <h4 className="font-medium text-sm text-gray-900">{book.title}</h4>
        <p className="text-xs text-gray-600">{book.author}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-sm font-medium text-gray-900">{book.borrowCount} borrows</span>
      <div className={`flex items-center justify-end text-xs ${
        book.trend === 'up' ? 'text-green-600' : 
        book.trend === 'down' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {book.trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
        {book.trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
        {book.trend}
      </div>
    </div>
  </div>
);

// System Status Component
const SystemStatusIndicator: React.FC<{ status: 'online' | 'offline'; label: string }> = ({ status, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'online' ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className={`text-sm font-medium ${
        status === 'online' ? 'text-green-600' : 'text-red-600'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  </div>
);

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  
  // Mock data - replace with actual API calls
  const overdueBooks: OverdueBook[] = [
    { id: '1', title: 'The Great Gatsby', borrower: 'John Doe', dueDate: '2024-01-15', daysOverdue: 3 },
    { id: '2', title: 'To Kill a Mockingbird', borrower: 'Jane Smith', dueDate: '2024-01-10', daysOverdue: 8 },
    { id: '3', title: '1984', borrower: 'Bob Johnson', dueDate: '2024-01-12', daysOverdue: 6 }
  ];

  const popularBooks: PopularBook[] = [
    { id: '1', title: 'Atomic Habits', author: 'James Clear', borrowCount: 45, trend: 'up' },
    { id: '2', title: 'The Midnight Library', author: 'Matt Haig', borrowCount: 38, trend: 'up' },
    { id: '3', title: 'Project Hail Mary', author: 'Andy Weir', borrowCount: 32, trend: 'stable' },
    { id: '4', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', borrowCount: 28, trend: 'down' },
    { id: '5', title: 'Dune', author: 'Frank Herbert', borrowCount: 25, trend: 'up' }
  ];

  const systemStatus: SystemStatus = {
    database: 'online',
    api: 'online',
    storage: 'online',
    lastChecked: new Date().toLocaleTimeString()
  };

  // Mock chart data - replace with actual chart library integration
  const chartData = timeRange === 'weekly' 
    ? { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [12, 19, 15, 22, 18, 25, 30] }
    : { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [45, 52, 48, 65] };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
          <p className="text-gray-600">Overall library oversight and analytics</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Books" 
            value="1,245" 
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            trend={{ value: '+12%', positive: true }}
          />
          
          <MetricCard 
            title="Active Readers" 
            value="89" 
            icon={<Users className="w-6 h-6 text-green-600" />}
            trend={{ value: '+5%', positive: true }}
          />
          
          <MetricCard 
            title="Librarians" 
            value="8" 
            icon={<Users className="w-6 h-6 text-purple-600" />}
            trend={{ value: '+0%', positive: true }}
          />
          
          <MetricCard 
            title="Overdue Books" 
            value="7" 
            icon={<AlertCircle className="w-6 h-6 text-red-600" />}
            trend={{ value: '-2%', positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Borrowing Trends Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Borrowing Trends</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimeRange('weekly')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      timeRange === 'weekly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimeRange('monthly')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      timeRange === 'monthly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              
              {/* Chart Placeholder - Replace with actual chart library */}
              <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Borrowing trends chart for {timeRange} view</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {chartData.labels.join(' • ')}: {chartData.values.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue from Fees</h2>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">$1,245.50</span>
                  <p className="text-sm text-green-600 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +15.2% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts and Rankings */}
          <div className="space-y-6">
            {/* Overdue Books Alert */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Overdue Books</h2>
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                  {overdueBooks.length} alerts
                </span>
              </div>
              
              <div className="space-y-2">
                {overdueBooks.map(book => (
                  <OverdueBookItem key={book.id} book={book} />
                ))}
              </div>
              
              <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                <Eye className="w-4 h-4 mr-1" />
                View all overdue books
              </button>
            </div>

            {/* Popular Books Ranking */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Books This Month</h2>
              
              <div className="space-y-2">
                {popularBooks.map((book, index) => (
                  <PopularBookItem key={book.id} book={book} rank={index + 1} />
                ))}
              </div>
            </div>

            {/* System Health Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health Status</h2>
              
              <div className="space-y-2">
                <SystemStatusIndicator status={systemStatus.database} label="Database" />
                <SystemStatusIndicator status={systemStatus.api} label="API Service" />
                <SystemStatusIndicator status={systemStatus.storage} label="File Storage" />
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Last checked: {systemStatus.lastChecked}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;