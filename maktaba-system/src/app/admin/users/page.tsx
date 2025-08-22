"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  UserX, 
  UserCheck, 
  Shield,
  Eye,
  Mail,
  Calendar
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'librarian' | 'reader';
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

// User role badge component
const UserRoleBadge = ({ role }: { role: string }) => {
  const roleStyles = {
    admin: 'bg-purple-100 text-purple-800',
    librarian: 'bg-blue-100 text-blue-800',
    reader: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles[role as keyof typeof roleStyles]}`}>
      {role}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status}
    </span>
  );
};

// Main component
const UserManagement: React.FC = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock data - replace with actual API calls
  const users: User[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'admin', status: 'active', joinDate: '2023-05-15', lastActive: '2024-01-20' },
    { id: '2', name: 'Michael Chen', email: 'michael@example.com', role: 'librarian', status: 'active', joinDate: '2023-08-22', lastActive: '2024-01-20' },
    { id: '3', name: 'Emma Wilson', email: 'emma@example.com', role: 'librarian', status: 'active', joinDate: '2023-09-10', lastActive: '2024-01-19' },
    { id: '4', name: 'James Rodriguez', email: 'james@example.com', role: 'reader', status: 'active', joinDate: '2023-10-05', lastActive: '2024-01-20' },
    { id: '5', name: 'Lisa Taylor', email: 'lisa@example.com', role: 'reader', status: 'inactive', joinDate: '2023-11-18', lastActive: '2023-12-15' },
    { id: '6', name: 'David Kim', email: 'david@example.com', role: 'reader', status: 'active', joinDate: '2023-12-01', lastActive: '2024-01-18' },
    { id: '7', name: 'Maria Garcia', email: 'maria@example.com', role: 'reader', status: 'active', joinDate: '2024-01-05', lastActive: '2024-01-20' },
    { id: '8', name: 'Robert Williams', email: 'robert@example.com', role: 'reader', status: 'inactive', joinDate: '2023-07-22', lastActive: '2023-11-30' }
  ];

  const activityLogs: ActivityLog[] = [
    { id: '1', userId: '2', action: 'BOOK_BORROW', timestamp: '2024-01-20 14:30', details: 'Borrowed "The Great Gatsby"' },
    { id: '2', userId: '3', action: 'BOOK_RETURN', timestamp: '2024-01-20 13:15', details: 'Returned "To Kill a Mockingbird"' },
    { id: '3', userId: '4', action: 'USER_CREATED', timestamp: '2024-01-20 11:45', details: 'New account created' },
    { id: '4', userId: '6', action: 'BOOK_RESERVE', timestamp: '2024-01-20 10:20', details: 'Reserved "1984"' },
    { id: '5', userId: '7', action: 'PROFILE_UPDATE', timestamp: '2024-01-20 09:30', details: 'Updated contact information' }
  ];

  // Filter users based on selected filters and search query
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  // Handle deactivate/reactivate user
  const handleToggleStatus = (user: User) => {
    console.log(`Toggling status for user: ${user.name}`);
    // API call would go here
  };

  // Handle add new user
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage all system users and their permissions</p>
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add User
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
                placeholder="Search users by name or email..."
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
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                  <option value="reader">Reader</option>
                </select>
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-800">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserRoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <div className="relative">
                          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              {user.status === 'active' ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Reactivate
                                </>
                              )}
                            </button>
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                              <Eye className="w-4 h-4 mr-2" />
                              View Activity
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Activity Logs Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent User Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activityLogs.map((log) => {
                    const user = users.find(u => u.id === log.userId);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {log.action.replace('_', ' ').toLowerCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{log.details}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal (simplified) */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <p className="text-gray-500 mb-4">User creation form would appear here.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal (simplified) */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit User: {selectedUser.name}</h3>
            <p className="text-gray-500 mb-4">User editing form would appear here.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;