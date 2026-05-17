import { Outlet } from 'react-router';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-gray-900 text-white p-4">
        <p className="font-bold mb-4">Admin Panel</p>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
