import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../shared/components/Sidebar';

const MainLayout: React.FC = () => (
  <div className="flex min-h-screen bg-surface">
    <Sidebar />
    <main className="flex-1 min-w-0 overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;