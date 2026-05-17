import { NavLink, Outlet } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Shield,
  ArrowLeft,
  Store,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '../routes/routes';
import { useAuthStore } from '@/features/auth';
import { useLogout } from '@/features/auth';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Products', icon: Package, to: ROUTES.ADMIN_PRODUCTS },
  { label: 'Orders', icon: ShoppingCart, to: ROUTES.ADMIN_ORDERS },
  { label: 'Users', icon: Users, to: ROUTES.ADMIN_USERS },
  { label: 'Roles', icon: Shield, to: ROUTES.ADMIN_ROLES },
];

export const AdminLayout = () => {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col bg-gray-900 text-white shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <Store size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Hoidanit Shop</p>
            <p className="text-xs text-gray-400 leading-tight">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-2 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Management
          </p>
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
          <NavLink
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Store
          </NavLink>
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
          >
            <LogOut size={16} />
            {isPending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <p className="text-sm text-gray-500">
            Welcome back, <span className="font-medium text-gray-800">{user?.name ?? 'Admin'}</span>
          </p>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {user?.email}
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
