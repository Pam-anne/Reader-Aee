"use client";

import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
import { BookOpen, User, Shield, Settings, ChevronRight, Book, CheckCircle, BarChart3 } from 'lucide-react';

type RoleId = 'reader' | 'librarian' | 'admin';

interface Role {
  id: RoleId;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const LibraryHomePage = () => {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  const router = useRouter();

  const roles: Role[] = [
    {
      id: 'reader',
      name: 'Reader',
      subtitle: 'Book Requester',
      description: 'Browse catalog, request books, and track your reading history',
      icon: <Book className="w-12 h-12" />,
      color: 'from-green-500 to-emerald-600',
      features: ['Browse Book Catalog', 'Request Books', 'Track Reading History', 'View Request Status']
    },
    {
      id: 'librarian',
      name: 'Librarian',
      subtitle: 'Approver & Inventory Manager',
      description: 'Manage book requests, inventory, and library operations',
      icon: <CheckCircle className="w-12 h-12" />,
      color: 'from-blue-500 to-cyan-600',
      features: ['Approve Book Requests', 'Manage Inventory', 'Add New Books', 'Handle Returns']
    },
    {
      id: 'admin',
      name: 'Admin',
      subtitle: 'Dashboard & Oversight',
      description: 'Monitor system performance, user management, and analytics',
      icon: <BarChart3 className="w-12 h-12" />,
      color: 'from-purple-500 to-indigo-600',
      features: ['System Analytics', 'User Management', 'Monitor Stock Levels', 'Generate Reports']
    }
  ];

 const handleRoleSelect = (roleId: RoleId): void => {
    setSelectedRole(roleId);
    if (roleId === 'librarian') {
      router.push(`/library/dashboard`);
    }
    else if (roleId === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white mb-2">Maktaba Digital</h1>
        </div>
        <p className="text-center text-blue-100 text-sm">
          Your Digital Library Management System
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Maktaba Digital</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard and start managing your library experience.
          </p>
        </div>

        {/* Workflow Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">System Workflow</h3>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2 text-green-600">
              <Book className="w-5 h-5" />
              <span className="font-medium">Reader Requests Book</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 rotate-90 md:rotate-0" />
            <div className="flex items-center space-x-2 text-blue-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Librarian Approves</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 rotate-90 md:rotate-0" />
            <div className="flex items-center space-x-2 text-purple-600">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Admin Monitors</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
                selectedRole === role.id ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${role.color} p-6 rounded-t-xl text-white`}>
                <div className="flex items-center justify-center mb-4">
                  {role.icon}
                </div>
                <h3 className="text-2xl font-bold text-center mb-1">{role.name}</h3>
                <p className="text-center text-sm opacity-90">{role.subtitle}</p>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-600 text-center mb-6">{role.description}</p>
                
                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Key Features:</h4>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <button 
                    className={`w-full bg-gradient-to-r ${role.color} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.id);
                    }}
                  >
                    <span>Enter as {role.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        {/* Team Assignment Info */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Types of Users</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Aee</h4>
              <p className="text-sm text-gray-600">Reader Interface</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Bee</h4>
              <p className="text-sm text-gray-600">Librarian Dashboard</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Cee</h4>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Maktaba Digital - Streamlining Library Management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LibraryHomePage;