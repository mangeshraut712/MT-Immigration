import { z } from "zod";

import {
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeSingleLineText,
} from "@/lib/sanitize";

export const defaultIntakeFormData = {
  name: "",
  email: "",
  phone: "",
  language: "",
  caseType: "",
  summary: "",
  hasPassport: false,
  hasReceipts: false,
  consent: false,
  website: "",
} as const;

export const intakeSchema = z.object({
  name: z.preprocess(
    (value) =>
      typeof value === "string" ? sanitizeSingleLineText(value) : value,
    z.string().min(2).max(120),
  ),
  email: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeEmail(value) : value),
    z.string().email().max(160),
  ),
  phone: z.preprocess(
    (value) => (typeof value === "string" ? sanitizePhone(value) : value),
    z.string().min(7).max(40),
  ),
  language: z.preprocess(
    (value) =>
      typeof value === "string" ? sanitizeSingleLineText(value) : value,
    z.string().min(1).max(60),
  ),
  caseType: z.preprocess(
    (value) =>
      typeof value === "string" ? sanitizeSingleLineText(value) : value,
    z.string().min(1).max(120),
  ),
  summary: z.preprocess(
    (value) =>
      typeof value === "string" ? sanitizeMultilineText(value) : value,
    z.string().min(30).max(2_000),
  ),
  hasPassport: z.boolean(),
  hasReceipts: z.boolean(),
  consent: z.boolean().refine((value) => value, {
    message: "Consent is required before submitting the form.",
  }),
  website: z.preprocess(
    (value) =>
      typeof value === "string" ? sanitizeSingleLineText(value) : value,
    z.string().max(0).optional().default(""),
  ),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
