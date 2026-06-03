import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

interface Props {
  title:     string;
  subtitle?: string;
  icon?:     LucideIcon;
  showBack?: boolean;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({ title, subtitle, icon: Icon, showBack, children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={16} />
          </button>
        )}
        {Icon && (
          <div className="w-9 h-9 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center">
            <Icon size={16} className="text-brand-400" />
          </div>
        )}
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};