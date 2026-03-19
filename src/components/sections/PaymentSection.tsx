"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Landmark,
  Lock,
  ShieldCheck,
} from "lucide-react";

import {
  ApplePayIcon,
  GooglePayIcon,
  PayPalIcon,
  StripeIcon,
} from "@/components/ui/payment-icons";
import { Button } from "@/components/ui/button";

import {
  paymentMethods,
  paymentUseCases,
  type PaymentMethod,
} from "@/config/payments";

import { cn } from "@/lib/utils";
import { fadeUpVariants, slideLeftVariants } from "@/lib/animations";

const iconMap = {
  "stripe-cards": StripeIcon,
  paypal: PayPalIcon,
  "apple-pay": ApplePayIcon,
  "google-pay": GooglePayIcon,
  "wire-transfer": Landmark,
} as const satisfies Record<
  PaymentMethod["id"],
  ComponentType<{ className?: string }>
>;

function getButtonProps(method: PaymentMethod) {
  const isExternal = method.href.startsWith("http");

  return {
    href: method.href,
    label: method.configured ? method.ctaLabel : method.ctaFallbackLabel,
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noreferrer noopener" : undefined,
  };
}

const trustBadges = [
  { icon: Lock, label: "Encrypted" },
  { icon: ShieldCheck, label: "Hosted checkout" },
  { icon: BadgeCheck, label: "No card data stored here" },
] as const;

export function PaymentSection() {
  const [selectedMethodId, setSelectedMethodId] =
    useState<PaymentMethod["id"]>("stripe-cards");

  const activeMethod =
    paymentMethods.find((method) => method.id === selectedMethodId) ??
    paymentMethods[0];
  const ActiveIcon = iconMap[activeMethod.id];
  const buttonProps = getButtonProps(activeMethod);

  return (
    <section
      id="payments"
      className="relative overflow-hidden border-t border-zinc-100 bg-zinc-50 py-16 md:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.025),transparent_50%)]" />

      <div className="container-wide relative z-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div
            variants={slideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Payments
                </span>
              </div>
              <h2 className="text-4xl font-serif font-medium leading-[1.06] tracking-tight text-zinc-950 md:text-5xl">
                Simple payment options,
                <br />
                <span className="text-zinc-400 italic font-light">
                  built for legal clients.
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
                Choose what you are paying for, then complete payment on the provider page.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Common Uses
              </p>
              <div className="mt-4 grid gap-3">
                {paymentUseCases.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/40 md:p-6"
          >
            <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Pay Now
                </p>
                <h3 className="mt-2 text-2xl font-serif font-medium tracking-tight text-zinc-950">
                  Select a payment method
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                <ShieldCheck className="h-4 w-4" />
                Provider checkout
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {paymentMethods.map((method) => {
                const Icon = iconMap[method.id];
                const isActive = method.id === activeMethod.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethodId(method.id)}
                    className={cn(
                      "inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm transition-all",
                      isActive
                        ? "border-black bg-black text-white shadow-md"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        isActive ? "bg-white/10 text-white" : "bg-white text-zinc-800",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{method.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      {activeMethod.provider}
                    </p>
                    <h4 className="mt-2 text-2xl font-serif font-medium tracking-tight text-zinc-950">
                      {activeMethod.title}
                    </h4>
                  </div>
                </div>
                {activeMethod.configured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Request link
                  </span>
                )}
              </div>

              <p className="mt-5 text-base leading-relaxed text-zinc-600">
                {activeMethod.summary}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Best for
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {activeMethod.bestFor}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Speed
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {activeMethod.speed}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Availability
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {activeMethod.availability}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {activeMethod.details.map((detail) => (
                  <div
                    key={detail}
                    className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-500" />
                    <p className="text-sm leading-relaxed text-zinc-600">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-black px-8 text-white hover:bg-zinc-800"
                >
                  <a
                    href={buttonProps.href}
                    target={buttonProps.target}
                    rel={buttonProps.rel}
                  >
                    {buttonProps.label}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-zinc-200 bg-white px-8 text-zinc-900 hover:bg-zinc-50"
                >
                  <Link href="/#contact">Need billing help</Link>
                </Button>
              </div>

              <p className="mt-5 border-t border-zinc-200 pt-5 text-sm leading-relaxed text-zinc-500">
                {activeMethod.note}
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
