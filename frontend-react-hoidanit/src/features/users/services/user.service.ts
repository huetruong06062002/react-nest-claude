import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { CreateUserPayload, UpdateUserPayload, User } from '../types/user.types';

export const userService = {
  getAll: () =>
    axiosInstance.get<ApiResponse<User[]>>('/admin/users'),

  getById: (id: number) =>
    axiosInstance.get<ApiResponse<User>>(`/admin/users/${id}`),

  create: (payload: CreateUserPayload) =>
    axiosInstance.post<ApiResponse<User>>('/admin/users', payload),

  update: (id: number, payload: UpdateUserPayload) =>
    axiosInstance.patch<ApiResponse<User>>(`/admin/users/${id}`, payload),

  delete: (id: number) =>
    axiosInstance.delete<void>(`/admin/users/${id}`),
};
