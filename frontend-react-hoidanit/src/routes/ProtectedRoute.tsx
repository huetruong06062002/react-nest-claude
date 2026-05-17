import { Navigate, Outlet } from 'react-router';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
  // Replace with useAuthStore().isAuthenticated once auth feature is built
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
