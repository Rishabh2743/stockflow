import { z } from 'zod';

export const settingsSchema = z.object({
  defaultLowStockThreshold: z.number().int().min(0, 'Must be 0 or greater'),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;