'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const value = {
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === 'admin',
    user: session?.user,
    isLoading: status === 'loading',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}