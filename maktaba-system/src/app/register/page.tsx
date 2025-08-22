"use client";

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Book, Shield, Eye, EyeOff, Mail, Lock, UserCheck, BookOpen } from 'lucide-react';

const LibrarySignUp = () => {
// Type definitions
interface RegisterFormData {
  Name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'reader' | 'librarian' | 'admin';
  libraryId: string;
  phone: string;
}

interface FormErrors {
  Name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  libraryId?: string;
}

interface Role {
  id: 'reader' | 'librarian' | 'admin';
  name: string;
  icon: any;
  description: string;
  user: string;
}

  const [formData, setFormData] = useState<RegisterFormData>({
    Name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
    libraryId: '',
    phone: ''
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const roles = [
    {
      id: 'reader',
      name: 'Reader (Book Requester)',
      icon: Book,
      description: 'Request books, browse catalog, manage personal reading list',
      user: 'Aee'
    },
    {
      id: 'librarian',
      name: 'Librarian (Approver & Inventory)',
      icon: UserCheck,
      description: 'Approve requests, manage inventory, oversee book circulation',
      user: 'Bee'
    },
    {
      id: 'admin',
      name: 'Admin (Dashboard & Oversight)',
      icon: Shield,
      description: 'Monitor system, view analytics, manage users and settings',
      user: 'Cee'
    }
  ];



const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if ((formData.role === 'librarian' || formData.role === 'admin') && !formData.libraryId.trim()) {
      newErrors.libraryId = 'Library ID is required for this role';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success simulation
      if (formData.role === 'reader') {
        router.push('/reader-dashboard');
      } else if (formData.role === 'librarian') {
        router.push('/librarian/dashboard');
      } else {
        router.push('/admin/dashboard');
      }

      // Reset form
      setFormData({
        Name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'reader',
        libraryId: '',
        phone: ''
      });
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = roles.find(role => role.id === formData.role);
  const RoleIcon = selectedRole?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <BookOpen className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white mb-2">Maktaba Digital</h1>
            </div>
            <p className="text-indigo-100 text-center">Create your account to get started</p>
          </div>

          <div className="px-8 py-8 space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid gap-3">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <label
                      key={role.id}
                      className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        formData.role === role.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={formData.role === role.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.role === role.id ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            formData.role === role.id ? 'text-indigo-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">{role.name}</h3>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {role.user}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.Name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.Name && (
                  <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
                )}
              </div>
            

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="w-full relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            </div>

            {/* Library ID for Librarian/Admin */}
            {(formData.role === 'librarian' || formData.role === 'admin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Library ID / Employee ID *
                </label>
                <input
                  type="text"
                  name="libraryId"
                  value={formData.libraryId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.libraryId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your library/employee ID"
                />
                {errors.libraryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.libraryId}</p>
                )}
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <RoleIcon className="h-5 w-5" />
                  <span>Create Account</span>
                </div>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Workflow</h3>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Reader Requests</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <span className="font-medium">Librarian Approves</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Admin Monitors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarySignUp;