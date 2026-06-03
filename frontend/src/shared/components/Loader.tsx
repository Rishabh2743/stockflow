import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-surface-border border-t-brand-500 rounded-full animate-spin" />
  </div>
);