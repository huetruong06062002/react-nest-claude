import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';

export const USERS_QUERY_KEY = ['users'] as const;

export const useUsers = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await userService.getAll();
      return data.data;
    },
  });
