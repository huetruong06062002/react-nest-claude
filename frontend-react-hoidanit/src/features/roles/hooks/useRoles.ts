import { useQuery } from '@tanstack/react-query';
import { roleService } from '../services/role.service';

export const ROLES_QUERY_KEY = ['roles'] as const;

export const useRoles = () =>
  useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await roleService.getAll();
      return data.data;
    },
  });
