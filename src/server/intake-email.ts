import "server-only";

import { firmConfig } from "@/config/firm";
import type { IntakeFormData } from "@/server/schemas/intake";

const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_TIMEOUT_MS = 8_000;

type IntakeConfirmationResult = {
  attempted: boolean;
  sent: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INTAKE_CONFIRMATION_FROM_EMAIL?.trim();
  const replyTo =
    process.env.INTAKE_CONFIRMATION_REPLY_TO?.trim() ||
    firmConfig.contact.email;

  if (!apiKey || !from) {
    return null;
  }

  return {
    apiKey,
    from,
    replyTo,
  };
}

export async function sendIntakeConfirmationEmail(
  intake: IntakeFormData,
): Promise<IntakeConfirmationResult> {
  const resend = getResendConfig();
  if (!resend) {
    return { attempted: false, sent: false };
  }

  const escapedName = escapeHtml(intake.name);
  const escapedCaseType = escapeHtml(intake.caseType);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resend.from,
        to: [intake.email],
        reply_to: resend.replyTo,
        subject: `${firmConfig.shortName}: We received your consultation request`,
        text: `Hello ${intake.name},\n\nWe received your consultation request for ${intake.caseType}. The office will review your intake and follow up using your preferred contact details within ${firmConfig.contact.responseTime}.\n\nIf your situation involves detention, court, or a filing deadline, please contact the office directly right away.\n\n${firmConfig.shortName}\n${firmConfig.contact.phoneDisplay}\n${firmConfig.contact.email}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18181b;">
            <p>Hello ${escapedName},</p>
            <p>We received your consultation request for <strong>${escapedCaseType}</strong>.</p>
            <p>The office will review your intake and follow up using your preferred contact details within <strong>${escapeHtml(firmConfig.contact.responseTime)}</strong>.</p>
            <p>If your situation involves detention, court, or a filing deadline, contact the office directly right away.</p>
            <p style="margin-top: 24px;">
              ${escapeHtml(firmConfig.shortName)}<br />
              ${escapeHtml(firmConfig.contact.phoneDisplay)}<br />
              ${escapeHtml(firmConfig.contact.email)}
            </p>
          </div>
        `,
      }),
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
      cache: "no-store",
    });

    return {
      attempted: true,
      sent: response.ok,
    };
  } catch {
    return {
      attempted: true,
      sent: false,
    };
  }
}
