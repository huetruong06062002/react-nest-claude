import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateRolePayload } from '../types/role.types';
import { roleService } from '../services/role.service';
import { ROLES_QUERY_KEY } from './useRoles';

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRolePayload }) =>
      roleService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
};
