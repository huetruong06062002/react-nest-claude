import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRoles } from './useRoles';
import { roleService } from '../services/role.service';
import { createWrapper } from '@/test-utils';

vi.mock('../services/role.service', () => ({
  roleService: {
    getAll: vi.fn(),
  },
}));

describe('useRoles hook', () => {
  it('should fetch and return roles', async () => {
    const mockRoles = [
      { id: 1, name: 'ADMIN', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    ];
    vi.mocked(roleService.getAll).mockResolvedValueOnce({
      data: { data: mockRoles, statusCode: 200, message: 'Success' },
    } as any);

    const { result } = renderHook(() => useRoles(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockRoles);
    expect(roleService.getAll).toHaveBeenCalled();
  });
});
