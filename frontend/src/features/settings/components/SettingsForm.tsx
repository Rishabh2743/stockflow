import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, type SettingsFormValues } from '../schemas/settingsSchema';
import type { Settings } from '../../../shared/types/settings.types';
import { Save } from 'lucide-react';

interface Props { settings: Settings; onSubmit: (v: SettingsFormValues) => Promise<Settings>; }

export const SettingsForm: React.FC<Props> = ({ settings, onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } =
    useForm<SettingsFormValues>({
      resolver: zodResolver(settingsSchema),
      defaultValues: { defaultLowStockThreshold: settings.defaultLowStockThreshold },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="label">Default Low Stock Threshold</label>
        <input
          {...register('defaultLowStockThreshold', { valueAsNumber: true })}
          type="number"
          min={0}
          className={`input max-w-xs ${errors.defaultLowStockThreshold ? 'border-red-500/50' : ''}`}
        />
        {errors.defaultLowStockThreshold && (
          <p className="mt-1.5 text-xs text-red-400">{errors.defaultLowStockThreshold.message}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Products without a custom threshold will use this value to determine low stock status.
        </p>
      </div>

      <button type="submit" disabled={isSubmitting || !isDirty} className="btn-primary">
        {isSubmitting
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
          : <><Save size={14} />Save Settings</>}
      </button>
    </form>
  );
};