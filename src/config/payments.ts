import { firmConfig } from '@/config/firm';

const contactFallbackHref = '/#contact';
const stripeCheckoutHref = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? contactFallbackHref;
const paypalCheckoutHref = process.env.NEXT_PUBLIC_PAYPAL_CHECKOUT_URL ?? contactFallbackHref;
const wireTransferInquiryHref = process.env.NEXT_PUBLIC_WIRE_TRANSFER_REQUEST_URL ?? contactFallbackHref;

export type PaymentMethodId =
  | 'stripe-cards'
  | 'paypal'
  | 'apple-pay'
  | 'google-pay'
  | 'wire-transfer';

export type PaymentMethod = {
  id: PaymentMethodId;
  title: string;
  provider: string;
  badge: string;
  summary: string;
  details: readonly string[];
  href: string;
  configured: boolean;
  ctaLabel: string;
  ctaFallbackLabel: string;
  note: string;
};

export const paymentHighlights = [
  'Hosted checkout',
  'Global-friendly',
  'Fast wallet support',
] as const;

export const acceptedPaymentLabels = [
  'Visa',
  'Mastercard',
  'Amex',
  'PayPal',
  'Apple Pay',
  'Google Pay',
  'Wire',
] as const;

export const paymentUseCases = [
  {
    title: 'Consultations',
    description: 'Quick one-time payments for new bookings and reviews.',
  },
  {
    title: 'Open invoices',
    description: 'Clean checkout for existing balances and issued links.',
  },
  {
    title: 'Retainers',
    description: 'Card, wallet, or wire support for larger matters.',
  },
] as const;

export const billingSupportNote = `Need the right link or invoice? ${firmConfig.contact.email} can help during business hours.`;

export const paymentMethods: readonly PaymentMethod[] = [
  {
    id: 'stripe-cards',
    title: 'Cards',
    provider: 'Stripe',
    badge: 'Most used',
    summary: 'A familiar checkout flow for credit and debit cards.',
    details: ['Visa, Mastercard, Amex, Discover', 'Best for most consultation and invoice payments'],
    href: stripeCheckoutHref,
    configured: Boolean(process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL),
    ctaLabel: 'Pay with Stripe',
    ctaFallbackLabel: 'Request card payment link',
    note: 'Clients complete payment on Stripe-hosted checkout rather than entering card details on this site.',
  },
  {
    id: 'paypal',
    title: 'PayPal',
    provider: 'PayPal',
    badge: 'International',
    summary: 'A simple option for clients who already prefer PayPal.',
    details: ['Use PayPal balance, bank, or linked card', 'Strong option for international payors'],
    href: paypalCheckoutHref,
    configured: Boolean(process.env.NEXT_PUBLIC_PAYPAL_CHECKOUT_URL),
    ctaLabel: 'Pay with PayPal',
    ctaFallbackLabel: 'Request PayPal link',
    note: 'Availability depends on region and the funding methods supported on the client account.',
  },
  {
    id: 'apple-pay',
    title: 'Apple Pay',
    provider: 'Stripe',
    badge: '1-tap',
    summary: 'Fast checkout on supported Apple devices and browsers.',
    details: ['Appears automatically on eligible devices', 'Great for mobile-first consultation payments'],
    href: stripeCheckoutHref,
    configured: Boolean(process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL),
    ctaLabel: 'Open Apple Pay',
    ctaFallbackLabel: 'Request Apple Pay link',
    note: 'Apple Pay shows inside Stripe checkout when the connected account and device support it.',
  },
  {
    id: 'google-pay',
    title: 'Google Pay',
    provider: 'Stripe',
    badge: '1-tap',
    summary: 'Fast wallet checkout for Android and Chrome users.',
    details: ['Available on supported devices and browsers', 'Ideal for quick invoice payments'],
    href: stripeCheckoutHref,
    configured: Boolean(process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL),
    ctaLabel: 'Open Google Pay',
    ctaFallbackLabel: 'Request Google Pay link',
    note: 'Google Pay appears through Stripe checkout when the wallet is supported on the client device.',
  },
  {
    id: 'wire-transfer',
    title: 'Wire',
    provider: 'Billing Desk',
    badge: 'Large payments',
    summary: 'A better fit for larger retainers and business-backed matters.',
    details: ['Best for higher-value payments', 'Instructions are shared after invoice verification'],
    href: wireTransferInquiryHref,
    configured: Boolean(process.env.NEXT_PUBLIC_WIRE_TRANSFER_REQUEST_URL),
    ctaLabel: 'Request wire instructions',
    ctaFallbackLabel: 'Contact billing desk',
    note: 'Wire instructions should always be confirmed directly with the firm before funds are sent.',
  },
] as const;
