// src/app/page.tsx
'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Eye, EyeOff, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

// Auth Context for managing global authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user data exists in localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || null;
    }
    return null;
  });

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Mock API call function
const loginAPI = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }
    const data = await response.json();

    console.log('Login API response status:', data);
    return {
      token: data.access_token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      }
    };
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error('Login failed');
  }
};

// Format date function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Days remaining function
const getDaysRemaining = (dueDateString: string): number => {
  const dueDate = new Date(dueDateString);
  const today = new Date();
  const timeDiff = dueDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Status badge component
const StatusBadge = ({ status, dueDate }: { status: string; dueDate?: string }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  if (status === 'approved') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status === 'pending') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (status === 'overdue') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
      {dueDate && status === 'approved' && ` • ${getDaysRemaining(dueDate)}d left`}
    </span>
  );
};

// Book card component
const BookCard = ({ book, onRequest, isBorrowingLimitReached }: { 
  book: { id: string; title: string; author: string; available: boolean }; 
  onRequest: (bookId: string) => void; 
  isBorrowingLimitReached: boolean;
}) => {
  const canRequest = book.available && !isBorrowingLimitReached;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-2">{book.title}</h3>
      <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          book.available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {book.available ? 'Available' : 'Checked Out'}
        </span>
        <button
          onClick={() => onRequest(book.id)}
          disabled={!canRequest}
          className={`px-3 py-1 text-sm rounded ${
            canRequest
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Request
        </button>
      </div>
    </div>
  );
};

// Main LoginForm Component
const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make API call
      const response = await loginAPI(formData);
      
      // Store user data and token
      login(response.user, response.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      // Handle login failure
      setGeneralError((error as Error).message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Maktaba Digital</h1>
          <p className="text-gray-600">Welcome back, Reader</p>
        </div>

        {/* General Error Message */}
        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{generalError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Email: reader@maktaba.com</p>
          <p className="text-xs text-gray-600">Password: password123</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component that provides Auth Context
const App = () => {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
};

export default App;