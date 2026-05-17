import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';
import { userService } from '../services/user.service';
import { createWrapper } from '@/test-utils';

vi.mock('../services/user.service', () => ({
  userService: {
    getAll: vi.fn(),
  },
}));

describe('useUsers hook', () => {
  it('should fetch and return users', async () => {
    const mockUsers = [
      {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        status: 'active',
        role: { id: 1, name: 'ADMIN' },
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];
    vi.mocked(userService.getAll).mockResolvedValueOnce({
      data: { data: mockUsers, success: true },
    } as any);

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUsers);
    expect(userService.getAll).toHaveBeenCalled();
  });
});
