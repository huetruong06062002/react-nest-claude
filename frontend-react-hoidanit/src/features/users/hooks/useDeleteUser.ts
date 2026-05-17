import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { USERS_QUERY_KEY } from './useUsers';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};
