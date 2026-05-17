import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from '../types/auth.types';

export const authService = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    axiosInstance.post<ApiResponse<AuthUser>>('/auth/register', payload),

  logout: () =>
    axiosInstance.post<void>('/auth/logout'),

  refresh: () =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/auth/refresh'),

  getMe: () =>
    axiosInstance.get<ApiResponse<AuthUser>>('/auth/me'),
};
