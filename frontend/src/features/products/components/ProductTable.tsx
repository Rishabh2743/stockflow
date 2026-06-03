import React from 'react';
import { Edit2, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../shared/types/product.types';
import clsx from 'clsx';

interface Props {
  products:         Product[];
  globalThreshold:  number;
  onDelete:         (product: Product) => void;
  onAdjust:         (product: Product) => void;
}

export const ProductTable: React.FC<Props> = ({ products, globalThreshold, onDelete, onAdjust }) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center gap-3">
        <p className="text-sm font-medium text-slate-300">No products found</p>
        <p className="text-xs text-slate-500">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {['Product', 'SKU', 'Stock', 'Status', 'Selling Price', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {products.map(p => {
              const threshold = p.lowStockThreshold ?? globalThreshold;
              const isLow     = p.quantityOnHand <= threshold;
              return (
                <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors group">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-200">{p.name}</p>
                    {p.description && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{p.description}</p>}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-400">{p.sku}</td>
                  <td className="px-5 py-4 font-mono font-medium text-slate-200">{p.quantityOnHand}</td>
                  <td className="px-5 py-4">
                    <span className={isLow ? 'badge-low' : 'badge-ok'}>
                      {isLow ? 'Low stock' : 'In stock'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {p.sellingPrice != null ? `$${p.sellingPrice.toFixed(2)}` : <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onAdjust(p)}
                        className="p-1.5 rounded-md hover:bg-brand-500/10 text-slate-400 hover:text-brand-400 transition-colors" title="Adjust stock">
                        <PlusCircle size={14} />
                      </button>
                      <button onClick={() => navigate(`/products/${p.id}/edit`)}
                        className="p-1.5 rounded-md hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onDelete(p)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};