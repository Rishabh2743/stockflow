import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  productSchema,
  type ProductFormValues,
} from '../schemas/productSchema';

import type { Product } from '../../../shared/types/product.types';

interface Props {
  defaultValues?: Partial<Product>;
  onSubmit: (values: ProductFormValues) => Promise<any>;
  submitLabel: string;
}

const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {error && (
      <p className="mt-1.5 text-xs text-red-400">
        {error}
      </p>
    )}
  </div>
);

export const ProductForm: React.FC<Props> = ({
  defaultValues,
  onSubmit,
  submitLabel,
}) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,

    defaultValues: {
      name: defaultValues?.name ?? '',
      sku: defaultValues?.sku ?? '',
      description: defaultValues?.description ?? '',

      quantityOnHand:
        defaultValues?.quantityOnHand ?? 0,

      costPrice:
        defaultValues?.costPrice,

      sellingPrice:
        defaultValues?.sellingPrice,

      lowStockThreshold:
        defaultValues?.lowStockThreshold,
    },
  });

  const submitHandler = async (
    data: ProductFormValues
  ) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          label="Product Name *"
          error={errors.name?.message}
        >
          <input
            {...register('name')}
            placeholder="Blue Cotton T-Shirt"
            className={`input ${
              errors.name
                ? 'border-red-500/50'
                : ''
            }`}
          />
        </Field>

        <Field
          label="SKU *"
          error={errors.sku?.message}
        >
          <input
            {...register('sku')}
            placeholder="TSHIRT-BLUE-001"
            className={`input font-mono ${
              errors.sku
                ? 'border-red-500/50'
                : ''
            }`}
          />
        </Field>
      </div>

      <Field
        label="Description"
        error={errors.description?.message}
      >
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Optional product description..."
          className={`input resize-none ${
            errors.description
              ? 'border-red-500/50'
              : ''
          }`}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field
          label="Quantity on Hand"
          error={errors.quantityOnHand?.message}
        >
          <input
            {...register('quantityOnHand', {
              valueAsNumber: true,
            })}
            type="number"
            min={0}
            placeholder="0"
            className={`input ${
              errors.quantityOnHand
                ? 'border-red-500/50'
                : ''
            }`}
          />
        </Field>

        <Field
          label="Cost Price ($)"
          error={errors.costPrice?.message}
        >
          <input
            {...register('costPrice', {
              valueAsNumber: true,
            })}
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            className={`input ${
              errors.costPrice
                ? 'border-red-500/50'
                : ''
            }`}
          />
        </Field>

        <Field
          label="Selling Price ($)"
          error={errors.sellingPrice?.message}
        >
          <input
            {...register('sellingPrice', {
              valueAsNumber: true,
            })}
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            className={`input ${
              errors.sellingPrice
                ? 'border-red-500/50'
                : ''
            }`}
          />
        </Field>
      </div>

      <Field
        label="Low Stock Threshold"
        error={errors.lowStockThreshold?.message}
      >
        <input
          {...register('lowStockThreshold', {
            valueAsNumber: true,
          })}
          type="number"
          min={0}
          placeholder="Leave empty to use global default"
          className={`input ${
            errors.lowStockThreshold
              ? 'border-red-500/50'
              : ''
          }`}
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;