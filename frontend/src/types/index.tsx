// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'reader' | 'librarian' | 'admin';
  borrowLimit: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}