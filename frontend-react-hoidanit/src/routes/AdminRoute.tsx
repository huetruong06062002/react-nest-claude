import { Navigate, Outlet } from 'react-router';
import { ROUTES } from './routes';
import { useAuthStore } from '@/features/auth';

export const AdminRoute = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
