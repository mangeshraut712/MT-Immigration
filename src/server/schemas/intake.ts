import { z } from 'zod';

export const defaultIntakeFormData = {
  name: '',
  email: '',
  phone: '',
  language: '',
  caseType: '',
  summary: '',
  hasPassport: false,
  hasReceipts: false,
  consent: false,
  website: '',
} as const;

export const intakeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(40),
  language: z.string().trim().min(1).max(60),
  caseType: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(30).max(2_000),
  hasPassport: z.boolean(),
  hasReceipts: z.boolean(),
  consent: z.boolean().refine((value) => value, {
    message: 'Consent is required before submitting the form.',
  }),
  website: z.string().trim().max(0).optional().default(''),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
