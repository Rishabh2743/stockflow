import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { Product } from '../../../shared/types/product.types';

interface Props {
  product:   Product | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel:  () => void;
}

export const DeleteProductDialog: React.FC<Props> = ({ product, isDeleting, onConfirm, onCancel }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-sm animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Delete product?</h3>
            <p className="text-sm text-slate-400">
              <span className="text-slate-200 font-medium">"{product.name}"</span> will be permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}  className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="btn-danger flex-1 justify-center">
            {isDeleting ? <><span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />Deleting...</> : <><Trash2 size={14} />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};