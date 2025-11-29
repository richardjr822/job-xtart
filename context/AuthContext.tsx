'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/interfaces';

type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  const setUser = useCallback((user: AuthUser | null) => {
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const checkAuth = useCallback(async () => {
    // Frontend-only: no backend auth check
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    router.push('/auth/login');
  }, [setUser, router]);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!state.user) return false;
      if (Array.isArray(role)) {
        return role.includes(state.user.role);
      }
      return state.user.role === role;
    },
    [state.user]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    ...state,
    setUser,
    logout,
    checkAuth,
    hasRole,
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

export function useRequireAuth(allowedRoles?: UserRole | UserRole[]) {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
      const redirectPath = user?.role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
      router.replace(redirectPath);
    }
  }, [isLoading, isAuthenticated, allowedRoles, hasRole, router, user?.role]);

  return { user, isLoading, isAuthorized: !allowedRoles || hasRole(allowedRoles) };
}
