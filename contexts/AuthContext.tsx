import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AdminUser } from '../types';
import * as api from '../api/mockApi';
import Spinner from '../components/Spinner';

interface AuthContextType {
  user: User | null;
  admin: AdminUser | null;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  adminLogout: () => void;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Customer Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Admin Auth State
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  // Check for logged in customer on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      setIsUserLoading(true);
      try {
          // Try to get profile from local storage mock
          const response = await api.getMe();
          if (response.success && response.data) {
              setUser(response.data);
          }
      } catch (e) {
          // Not logged in, ignore
      } finally {
          setIsUserLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // Check for logged in admin on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsAdminLoading(true);
      if (localStorage.getItem('adminAuthToken')) {
         try {
          const response = await api.getAdminMe();
          setAdmin(response.data);
        } catch (error) {
          localStorage.removeItem('adminAuthToken');
        }
      }
      setIsAdminLoading(false);
    };
    checkAdminStatus();
  }, []);

  const signup = async (name: string, email: string, pass: string) => {
     const response = await api.signup(name, email, pass);
     if (response.success && response.data) {
         setUser(response.data);
     }
  };

  const login = async (email: string, pass: string) => {
     const response = await api.login(email, pass);
     if (response.success && response.data) {
         setUser(response.data);
     }
  };
  
  const adminLogin = async (email: string, pass: string) => {
    const response = await api.adminLogin(email, pass);
    setAdmin(response.data.admin);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const adminLogout = async () => {
    await api.adminLogout();
    setAdmin(null);
  };

  const isLoading = isUserLoading || isAdminLoading;

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      signup,
      login,
      logout,
      adminLogin,
      adminLogout,
      isAuthenticated: !!user,
      isAdminAuthenticated: !!admin,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};