import React from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  label:    string;
  value:    string | number;
  icon:     LucideIcon;
  accent?:  'teal' | 'red' | 'amber' | 'blue';
  sublabel?: string;
}

const accentMap = {
  teal:  'text-brand-400 bg-brand-500/10 border-brand-500/20',
  red:   'text-red-400   bg-red-500/10   border-red-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  blue:  'text-blue-400  bg-blue-500/10  border-blue-500/20',
};

export const StatCard: React.FC<Props> = ({ label, value, icon: Icon, accent = 'teal', sublabel }) => (
  <div className="card p-5 flex items-start gap-4 animate-slide-up hover:border-surface-hover transition-colors">
    <div className={clsx('w-10 h-10 rounded-lg border flex items-center justify-center shrink-0', accentMap[accent])}>
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-semibold text-white font-mono">{value}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
    </div>
  </div>
);