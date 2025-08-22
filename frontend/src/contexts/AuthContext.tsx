// src/contexts/AuthContext.tsx
'use client'; // This is necessary because context uses React hooks

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/index'; // Import your types

// 1. Create the context with an undefined initial value, but with the correct type.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create a provider component that will wrap your app.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // ✅ This is the correct place for this state!
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Helpful for checking if we've finished checking for a logged-in user

  // A placeholder login function. You will replace this with your actual API call.
  const login = async (email: string, password: string): Promise<void> => {
    // TODO: Replace with real API call to /api/auth/login
    console.log('Logging in with:', email, password);
    // Simulate API call
    setIsLoading(true);
    try {
      // const response = await fetch('/api/auth/login', ...)
      // const userData = await response.json();
      // setUser(userData);

      // Simulated successful login
      setUser({
        id: '1',
        name: 'Test Reader',
        email: email,
        role: 'reader',
        borrowLimit: 5
      });
    } catch (error) {
      console.error('Login failed', error);
      throw error; // Re-throw to handle in the UI
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // TODO: Also call API to invalidate token on server
    setUser(null);
  };

  // Optional: Check for existing auth on initial load (e.g., a token in localStorage)
  useEffect(() => {
    const checkAuthStatus = () => {
      // const token = localStorage.getItem('token');
      // if (token) { ...logic to validate token and fetch user... }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  // 3. The value that will be supplied to any component that uses this context
  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  // 4. Return the Provider with the value, wrapping the children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Create a custom hook for easy access to the context
// This is what you will use in your pages (like dashboard)
export const useAuth = () => {
  const context = useContext(AuthContext);
  // This ensures the hook is used within an AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};