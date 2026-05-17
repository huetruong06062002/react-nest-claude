import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b flex items-center px-6">
        <span className="font-bold text-lg">hoidanit-ecommerce</span>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="h-12 border-t flex items-center justify-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} hoidanit-ecommerce
      </footer>
    </div>
  );
};
