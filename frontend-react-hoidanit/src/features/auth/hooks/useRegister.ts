import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../services/auth.service';
import { ROUTES } from '@/routes/routes';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      void navigate(ROUTES.LOGIN);
    },
  });
};
