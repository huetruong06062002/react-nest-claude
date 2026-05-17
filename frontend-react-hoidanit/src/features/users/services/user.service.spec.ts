import { describe, it, expect, vi, afterEach } from 'vitest';
import { userService } from './user.service';
import { axiosInstance } from '@/shared/lib/axios';

vi.mock('@/shared/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('userService', () => {
  const mockUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    status: 'active' as const,
    role: { id: 1, name: 'ADMIN' },
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call axios.get with /admin/users', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: [mockUser] } });
      const response = await userService.getAll();
      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/users');
      expect(response).toEqual({ data: { data: [mockUser] } });
    });
  });

  describe('getById', () => {
    it('should call axios.get with the correct user id', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: mockUser } });
      const response = await userService.getById(1);
      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/users/1');
      expect(response).toEqual({ data: { data: mockUser } });
    });
  });

  describe('create', () => {
    it('should call axios.post with the payload', async () => {
      const payload = { email: 'new@example.com', name: 'New User', password: 'pass123' };
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { data: mockUser } });
      const response = await userService.create(payload);
      expect(axiosInstance.post).toHaveBeenCalledWith('/admin/users', payload);
      expect(response).toEqual({ data: { data: mockUser } });
    });
  });

  describe('update', () => {
    it('should call axios.patch with id and payload', async () => {
      const payload = { name: 'Updated Name' };
      vi.mocked(axiosInstance.patch).mockResolvedValueOnce({ data: { data: { ...mockUser, ...payload } } });
      const response = await userService.update(1, payload);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/admin/users/1', payload);
      expect(response).toEqual({ data: { data: { ...mockUser, ...payload } } });
    });
  });

  describe('delete', () => {
    it('should call axios.delete with the correct id', async () => {
      vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: null });
      const response = await userService.delete(1);
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/users/1');
      expect(response).toEqual({ data: null });
    });
  });
});
