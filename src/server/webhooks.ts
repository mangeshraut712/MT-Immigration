import "server-only";

import { createHmac, randomUUID } from "node:crypto";

export type SignedWebhookHeaders = {
  "Content-Type": "application/json";
  "X-Webhook-Delivery": string;
  "X-Webhook-Timestamp": string;
  "X-Webhook-Signature"?: string;
  Authorization?: string;
};

export function buildSignedWebhookHeaders(
  body: string,
  options?: {
    bearerToken?: string | null;
    signingSecret?: string | null;
  },
): SignedWebhookHeaders {
  const deliveryId = randomUUID();
  const timestamp = new Date().toISOString();
  const signingSecret = options?.signingSecret?.trim();
  const bearerToken = options?.bearerToken?.trim();

  const headers: SignedWebhookHeaders = {
    "Content-Type": "application/json",
    "X-Webhook-Delivery": deliveryId,
    "X-Webhook-Timestamp": timestamp,
  };

  if (signingSecret) {
    headers["X-Webhook-Signature"] = createHmac("sha256", signingSecret)
      .update(`${timestamp}.${body}`)
      .digest("hex");
  }

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  return headers;
}
