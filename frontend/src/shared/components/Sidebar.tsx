import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Package as Logo } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import clsx from 'clsx';

const navItems = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products',  icon: Package },
  { to: '/settings', label: 'Settings',  icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-surface-card border-r border-surface-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-surface-border">
        <div className="w-8 h-8 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center">
          <Logo size={16} className="text-brand-400" />
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">StockFlow</span>
      </div>

      {/* Org name */}
      <div className="px-5 py-3 border-b border-surface-border">
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-0.5">Organization</p>
        <p className="text-xs font-medium text-slate-300 truncate">{user?.organization?.name}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
            )}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-surface-border pt-3">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
};