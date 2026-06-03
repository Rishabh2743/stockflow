import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { User } from '../../../shared/types/auth.types';
import { authApi } from '../api/authApi';

interface AuthContextValue {
  user:          User | null;
  isAuthenticated: boolean;
  isLoading:     boolean;
  setUser:       (user: User | null) => void;
  logout:        () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};