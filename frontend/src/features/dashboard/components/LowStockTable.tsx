import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { LowStockItem } from '../../../shared/types/dashboard.types';

interface Props { items: LowStockItem[]; }

export const LowStockTable: React.FC<Props> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
          <AlertTriangle size={20} className="text-brand-400" />
        </div>
        <p className="text-sm font-medium text-slate-300">All stock levels are healthy</p>
        <p className="text-xs text-slate-500">No products are below their threshold</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border flex items-center gap-2">
        <AlertTriangle size={15} className="text-red-400" />
        <h3 className="text-sm font-medium text-slate-200">Low Stock Alerts</h3>
        <span className="ml-auto badge-low">{items.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {['Product', 'SKU', 'On Hand', 'Threshold'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-surface-hover/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-200">{item.name}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{item.sku}</td>
                <td className="px-5 py-3.5">
                  <span className="badge-low">{item.quantityOnHand}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-400">{item.lowStockThreshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};