import { describe, it, expect, vi, afterEach } from 'vitest';
import { roleService } from './role.service';
import { axiosInstance } from '@/shared/lib/axios';

vi.mock('@/shared/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('roleService', () => {
  const mockRole = {
    id: 1,
    name: 'ADMIN',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call axios.get with /admin/roles', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: [mockRole] } });
      const response = await roleService.getAll();
      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/roles');
      expect(response).toEqual({ data: { data: [mockRole] } });
    });
  });

  describe('getById', () => {
    it('should call axios.get with correct id', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: mockRole } });
      const response = await roleService.getById(1);
      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/roles/1');
      expect(response).toEqual({ data: { data: mockRole } });
    });
  });

  describe('create', () => {
    it('should call axios.post with payload', async () => {
      const payload = { name: 'SUPER_ADMIN' };
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { data: mockRole } });
      const response = await roleService.create(payload);
      expect(axiosInstance.post).toHaveBeenCalledWith('/admin/roles', payload);
      expect(response).toEqual({ data: { data: mockRole } });
    });
  });

  describe('update', () => {
    it('should call axios.patch with id and payload', async () => {
      const payload = { name: 'SUPER_ADMIN' };
      vi.mocked(axiosInstance.patch).mockResolvedValueOnce({ data: { data: mockRole } });
      const response = await roleService.update(1, payload);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/admin/roles/1', payload);
      expect(response).toEqual({ data: { data: mockRole } });
    });
  });

  describe('delete', () => {
    it('should call axios.delete with correct id', async () => {
      vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: null });
      const response = await roleService.delete(1);
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/roles/1');
      expect(response).toEqual({ data: null });
    });
  });
});
