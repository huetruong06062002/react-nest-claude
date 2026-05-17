import { Navigate, Outlet } from 'react-router';
import { ROUTES } from './routes';

export const AdminRoute = () => {
  // Replace with useAuthStore() role check once auth feature is built
  const isAdmin = false;

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
