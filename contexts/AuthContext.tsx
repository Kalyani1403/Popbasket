import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../constants';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'password' | 'phone' | 'addresses' | 'avatar'>>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    // In a real app, you'd fetch this from an API
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const storedUser = window.localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Could not parse user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<void> => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    if (users.some(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'user', // Default role is 'user'
    };
    // In a real app, this would be an API call to register the user
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'email' | 'password' | 'phone' | 'addresses' | 'avatar'>>): Promise<void> => {
    if (!currentUser) {
      throw new Error('No authenticated user.');
    }

    // If email is being changed, ensure uniqueness
    if (updates.email && users.some(u => u.email === updates.email && u.id !== currentUser.id)) {
      throw new Error('Another account with this email already exists.');
    }

  // Merge addresses carefully: if updates.addresses provided, replace; otherwise keep existing
  const merged: User = { ...currentUser, ...updates } as User;

    // If addresses provided ensure ids for new addresses
    if (updates.addresses) {
      merged.addresses = updates.addresses.map(a => ({ ...a }));
    }

    setUsers(prev => prev.map(u => (u.id === currentUser.id ? merged : u)));
    setCurrentUser(merged);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};