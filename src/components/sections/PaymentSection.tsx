'use client';

import { useState, type ComponentType } from 'react';
import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Check,
} from 'lucide-react';

import { ApplePayIcon, GooglePayIcon, PayPalIcon, StripeIcon } from '@/components/ui/payment-icons';
import { Button } from '@/components/ui/button';

import { firmConfig } from '@/config/firm';
import {
  acceptedPaymentLabels,
  billingSupportNote,
  paymentMethods,
  paymentUseCases,
  type PaymentMethod,
} from '@/config/payments';

import { cn } from '@/lib/utils';
import { fadeUpVariants, slideLeftVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

const iconMap = {
  'stripe-cards': StripeIcon,
  paypal: PayPalIcon,
  'apple-pay': ApplePayIcon,
  'google-pay': GooglePayIcon,
  'wire-transfer': Landmark,
} as const satisfies Record<PaymentMethod['id'], ComponentType<{ className?: string }>>;

function getButtonProps(method: PaymentMethod) {
  const isExternal = method.href.startsWith('http');

  return {
    href: method.href,
    label: method.configured ? method.ctaLabel : method.ctaFallbackLabel,
    target: isExternal ? '_blank' : undefined,
    rel: isExternal ? 'noreferrer noopener' : undefined,
  };
}

const trustBadges = [
  { icon: Lock, label: 'SSL Encrypted' },
  { icon: ShieldCheck, label: 'PCI Compliant' },
  { icon: CheckCircle2, label: 'No card stored' },
] as const;

export function PaymentSection() {
  const [selectedMethodId, setSelectedMethodId] = useState<PaymentMethod['id']>('stripe-cards');

  const activeMethod =
    paymentMethods.find((method) => method.id === selectedMethodId) ?? paymentMethods[0];

  const buttonProps = getButtonProps(activeMethod);
  const ActiveIcon = iconMap[activeMethod.id];

  return (
    <section
      id="payments"
      className="section-padding bg-zinc-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.02),transparent_50%)]" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left Column */}
          <motion.div
            variants={slideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-32 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-zinc-300"></div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                    Online Payments
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground mt-4 mb-6 leading-[1.1]">
                  Pay online in a way <br />
                  <span className="text-zinc-400 italic font-light">that feels familiar.</span>
                </h2>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  A simpler, cleaner payment flow for consultations, invoices, and larger retainers.
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h4 className="font-serif font-medium text-foreground text-lg">Accepted methods</h4>
                <div className="flex flex-wrap gap-2">
                  {acceptedPaymentLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-4">
                <h4 className="font-serif font-medium text-foreground text-lg">Use Cases</h4>
                <motion.ul
                  variants={staggerContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  {paymentUseCases.map((item) => (
                    <motion.li
                      key={item.title}
                      variants={staggerItemVariants}
                      className="flex items-start gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-zinc-700" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 text-sm">{item.title}</p>
                        <p className="text-sm text-zinc-500 mt-1">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.div>

          {/* Right Column Checkout UI */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/50 p-6 sm:p-8">
              <div className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-medium text-zinc-900">
                    Choose a method
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    Select the option below to see secure checkout details.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-50 border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  <ShieldCheck className="h-4 w-4" />
                  Hosted Checkout
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {paymentMethods.map((method) => {
                  const Icon = iconMap[method.id];
                  const isActive = method.id === activeMethod.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethodId(method.id)}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-all duration-200',
                        isActive
                          ? 'border-black bg-black text-white shadow-lg'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-300 hover:bg-white',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl border',
                            isActive ? 'border-zinc-800 bg-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-700',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{method.title}</p>
                          <p
                            className={cn(
                              'mt-0.5 text-[10px] font-semibold uppercase tracking-widest',
                              isActive ? 'text-zinc-400' : 'text-zinc-500',
                            )}
                          >
                            {method.badge}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMethod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-sm">
                          <ActiveIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                            {activeMethod.provider}
                          </p>
                          <h4 className="mt-1 text-2xl font-serif font-medium text-zinc-900">
                            {activeMethod.title}
                          </h4>
                        </div>
                      </div>
                      {activeMethod.configured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                          Request link
                        </span>
                      )}
                    </div>

                    <p className="mt-6 text-base text-zinc-600">
                      {activeMethod.summary}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {activeMethod.details.map((detail) => (
                        <div
                          key={detail}
                          className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
                          <p className="text-sm text-zinc-600">{detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button
                        asChild
                        className="h-12 w-full rounded-full bg-black px-8 text-white hover:bg-zinc-800 shadow-lg sm:w-auto"
                      >
                        <a href={buttonProps.href} target={buttonProps.target} rel={buttonProps.rel}>
                          {buttonProps.label}
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-12 w-full rounded-full border-zinc-200 bg-white px-8 text-zinc-900 hover:bg-zinc-50 sm:w-auto"
                      >
                        <Link href="/#contact">Need invoice help</Link>
                      </Button>
                    </div>

                    <p className="mt-5 text-xs text-zinc-500 border-t border-zinc-200/60 pt-5">{activeMethod.note}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Billing Support</p>
                  <p className="mt-1 text-sm text-zinc-500">{billingSupportNote}</p>
                </div>
                <a
                  href={firmConfig.contact.emailHref}
                  className="mt-4 sm:mt-0 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
                >
                  {firmConfig.contact.email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
