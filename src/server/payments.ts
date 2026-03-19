import "server-only";

import type { PaymentMethodId } from "@/config/payments";

const PAYMENT_HOST_ALLOWLIST: Record<PaymentMethodId, readonly string[]> = {
  "stripe-cards": ["buy.stripe.com", "checkout.stripe.com"],
  paypal: ["paypal.com", "www.paypal.com", "paypal.me"],
  "apple-pay": ["buy.stripe.com", "checkout.stripe.com"],
  "google-pay": ["buy.stripe.com", "checkout.stripe.com"],
  "wire-transfer": [],
};

const PAYMENT_ENV_KEYS: Record<PaymentMethodId, readonly string[]> = {
  "stripe-cards": ["STRIPE_CHECKOUT_URL", "NEXT_PUBLIC_STRIPE_CHECKOUT_URL"],
  paypal: ["PAYPAL_CHECKOUT_URL", "NEXT_PUBLIC_PAYPAL_CHECKOUT_URL"],
  "apple-pay": ["STRIPE_CHECKOUT_URL", "NEXT_PUBLIC_STRIPE_CHECKOUT_URL"],
  "google-pay": ["STRIPE_CHECKOUT_URL", "NEXT_PUBLIC_STRIPE_CHECKOUT_URL"],
  "wire-transfer": [
    "WIRE_TRANSFER_REQUEST_URL",
    "NEXT_PUBLIC_WIRE_TRANSFER_REQUEST_URL",
  ],
};

function resolveConfiguredUrl(methodId: PaymentMethodId) {
  const keys = PAYMENT_ENV_KEYS[methodId];

  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return null;
}

function isAllowedPaymentHost(methodId: PaymentMethodId, hostname: string) {
  const allowedHosts = PAYMENT_HOST_ALLOWLIST[methodId];
  if (allowedHosts.length === 0) {
    return true;
  }

  const normalizedHost = hostname.toLowerCase();
  return allowedHosts.some(
    (allowedHost) =>
      normalizedHost === allowedHost ||
      normalizedHost.endsWith(`.${allowedHost}`),
  );
}

export function resolvePaymentRedirect(methodId: PaymentMethodId) {
  const rawUrl = resolveConfiguredUrl(methodId);
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") {
      return null;
    }

    if (!isAllowedPaymentHost(methodId, url.hostname)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
