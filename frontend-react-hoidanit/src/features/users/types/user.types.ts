export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: number;
  email: string;
  name: string;
  status: UserStatus;
  role: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  status?: UserStatus;
  roleId?: number;
}

export interface UpdateUserPayload {
  email?: string;
  name?: string;
  password?: string;
  status?: UserStatus;
  roleId?: number | null;
}
