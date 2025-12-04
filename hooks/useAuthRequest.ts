'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/authService';

export type RegisterData = authService.RegisterInput;
export type LoginData = authService.LoginInput;

export function useAuthRequest() {
  const [manualError, setManualError] = useState<string | null>(null);

  const registerMutation = useMutation({ mutationFn: authService.registerUser });
  const loginMutation = useMutation({ mutationFn: authService.loginUser });

  const isLoading = registerMutation.isPending || loginMutation.isPending;
  const error = manualError || registerMutation.error?.message || loginMutation.error?.message || null;

  const register = (data: RegisterData) => registerMutation.mutateAsync(data);
  const login = (data: LoginData) => loginMutation.mutateAsync(data);
  const logout = () => authService.logoutUser();

  return useMemo(
    () => ({ isLoading, error, setError: setManualError, register, login, logout }),
    [isLoading, error]
  );
}
