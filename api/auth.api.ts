import { apiClient } from './client';
import type { AuthResponse } from './types';

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', { email, password });
  },

  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<AuthResponse> => {
    // Envia o passwordConfirmation, mesmo que provisoriamente
    return apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      passwordConfirmation: confirmPassword || password,
    });
  },
};
