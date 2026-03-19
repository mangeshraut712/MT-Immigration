import { z } from "zod";

export const emptySearchParamsSchema = z.object({}).strict();

export const insightSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const paymentMethodParamSchema = z.object({
  method: z.enum([
    "stripe-cards",
    "paypal",
    "apple-pay",
    "google-pay",
    "wire-transfer",
  ]),
});

export type InsightSlugParams = z.infer<typeof insightSlugParamSchema>;
export type PaymentMethodParams = z.infer<typeof paymentMethodParamSchema>;
