import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { RolesPage } from '@/features/roles';
import { UsersPage } from '@/features/users';

export const router = createBrowserRouter([
  // Public routes with main layout
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <div>Home Page (coming soon)</div> },
      { path: '/products', element: <div>Product List (coming soon)</div> },
      { path: '/products/:slug', element: <div>Product Detail (coming soon)</div> },
      { path: '/categories/:slug', element: <div>Category (coming soon)</div> },
    ],
  },
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <div>Login (coming soon)</div> },
      { path: '/register', element: <div>Register (coming soon)</div> },
    ],
  },
  // Protected user routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/cart', element: <div>Cart (coming soon)</div> },
          { path: '/checkout', element: <div>Checkout (coming soon)</div> },
          { path: '/orders', element: <div>Orders (coming soon)</div> },
          { path: '/orders/:id', element: <div>Order Detail (coming soon)</div> },
          { path: '/profile', element: <div>Profile (coming soon)</div> },
        ],
      },
    ],
  },
  // Admin routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'products', element: <div>Admin Products (coming soon)</div> },
          { path: 'orders', element: <div>Admin Orders (coming soon)</div> },
          { path: 'roles', element: <RolesPage /> },
          { path: 'users', element: <UsersPage /> },
        ],
      },
    ],
  },
]);
