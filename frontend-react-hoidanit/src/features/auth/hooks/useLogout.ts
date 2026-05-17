import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '@/routes/routes';

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      void navigate(ROUTES.LOGIN);
    },
  });
};
