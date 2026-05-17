import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '@/routes/routes';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      const { user, accessToken } = data.data;
      setAuth(user, accessToken);

      const isAdmin = user.role?.toLowerCase() === 'admin';
      void navigate(isAdmin ? ROUTES.ADMIN_USERS : ROUTES.HOME);
    },
  });
};
