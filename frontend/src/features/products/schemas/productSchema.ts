import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200),

  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(100)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      'SKU: letters, numbers, hyphens only'
    ),

  description: z
    .string()
    .max(1000)
    .optional(),

  quantityOnHand: z.coerce
    .number()
    .int()
    .min(0, 'Quantity cannot be negative'),

  costPrice: z.coerce
    .number()
    .min(0, 'Cost price cannot be negative')
    .optional(),

  sellingPrice: z.coerce
    .number()
    .min(0, 'Selling price cannot be negative')
    .optional(),

  lowStockThreshold: z.preprocess(
  (value) => {
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      Number.isNaN(value)
    ) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().min(0).optional()
),
});

export type ProductFormValues = z.infer<typeof productSchema>;