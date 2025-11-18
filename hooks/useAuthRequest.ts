import { useState } from 'react';
import * as authService from '../services/authService';

interface RegisterData {
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UseAuthRequestResult {
  isLoading: boolean;
  error: any;
  setError: (err: any) => void;
  register: (userData: RegisterData) => Promise<any>;
  login: (credentials: LoginData) => Promise<any>;
  logout: () => Promise<any>;
}

export const useAuthRequest = (): UseAuthRequestResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const handleRequest = async <T>(
    serviceFunction: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await serviceFunction(...args);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    setError,
    register: (userData: RegisterData) => handleRequest(authService.registerUser, userData),
    login: (credentials: LoginData) => handleRequest(authService.loginUser, credentials),
    logout: () => handleRequest(authService.logoutUser),
  };
};