import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserPayload } from '../types/user.types';
import { userService } from '../services/user.service';
import { USERS_QUERY_KEY } from './useUsers';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      userService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};
