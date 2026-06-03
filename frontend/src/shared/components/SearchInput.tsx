import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative flex-1 max-w-sm">
    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input pl-9 pr-8"
    />
    {value && (
      <button onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
        <X size={12} />
      </button>
    )}
  </div>
);