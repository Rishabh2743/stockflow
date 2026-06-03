import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpDown } from 'lucide-react';
import type { Product } from '../../../shared/types/product.types';

const schema = z.object({
  adjustment: z.coerce.number().int('Must be a whole number').refine(v => v !== 0, 'Cannot be zero'),
  note:       z.string().max(255).optional(),
});



interface Props {
  product:     Product | null;
  isSubmitting: boolean;
  onConfirm:   (adjustment: number, note?: string) => void;
  onCancel:    () => void;
}

export const AdjustStockDialog: React.FC<Props> = ({ product, isSubmitting, onConfirm, onCancel }) => {
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});

  if (!product) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-sm animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center">
            <ArrowUpDown size={16} className="text-brand-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Adjust Stock</h3>
            <p className="text-xs text-slate-400 font-mono">{product.sku} · Current: {product.quantityOnHand}</p>
          </div>
        </div>

        <form
  onSubmit={handleSubmit((data) => {
    onConfirm(data.adjustment, data.note);
  })}
  className="space-y-4"
>
          <div>
            <label className="label">Adjustment (+/-)</label>
            <input {...register('adjustment')} type="number" placeholder="+20 or -5"
              className={`input font-mono ${errors.adjustment ? 'border-red-500/50' : ''}`} autoFocus />
            {errors.adjustment && <p className="mt-1 text-xs text-red-400">{errors.adjustment.message}</p>}
          </div>
          <div>
            <label className="label">Note (optional)</label>
            <input {...register('note')} placeholder="e.g. Restocked from supplier" className="input" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancel}  className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit"  disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Apply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};