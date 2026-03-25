"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  slideLeftVariants,
} from "@/lib/animations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { localizeHref } from "@/i18n/routing";

type PricingItem = {
  service: string;
  price: string;
  includes: string;
};

export function PricingSection() {
  const pathname = usePathname();
  const tPricing = useTranslations("pricing");
  const pricingData = tPricing.raw("items") as PricingItem[];
  const benefits = tPricing.raw("benefits") as string[];

  return (
    <section
      id="pricing"
      className="section-padding relative overflow-hidden bg-gradient-subtle"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.05),transparent_42%)]" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Sticky sidebar */}
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
                    {tPricing("title")}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground mt-4 mb-6 leading-[1.1]">
                  {tPricing("heading")}
                </h2>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  {tPricing("subtitle")}
                </p>
                <p className="surface-inset mt-4 p-4 text-sm text-muted-foreground shadow-sm">
                  <strong>{tPricing("noteLabel")}</strong> {tPricing("note")}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif font-medium text-foreground text-lg">
                  {tPricing("whyChoose")}
                </h4>
                <motion.ul
                  variants={staggerContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {benefits.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={staggerItemVariants}
                      className="flex items-center gap-3 text-sm text-zinc-600"
                    >
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                        <Check className="w-3 h-3" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-xl bg-foreground text-base text-background shadow-lg transition-all hover:opacity-92 hover:shadow-xl"
              >
                <Link href={localizeHref(pathname, "/#contact")}>
                  {tPricing("cta")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Pricing table */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="surface-panel overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-2xl md:rounded-3xl">
              <Table className="min-w-[42rem]">
                <TableHeader>
                  <TableRow className="border-b border-border/70 bg-muted/45 hover:bg-muted/45">
                    <TableHead className="w-[40%] font-serif font-bold text-foreground py-6 text-lg pl-8">
                      {tPricing("service")}
                    </TableHead>
                    <TableHead className="w-[25%] font-serif font-bold text-foreground text-lg">
                      {tPricing("priceRange")}
                    </TableHead>
                    <TableHead className="font-serif font-bold text-foreground text-lg pr-8">
                      {tPricing("includes")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingData.map((item, index) => (
                    <motion.tr
                      key={item.service}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-default border-b border-border/40 transition-colors duration-200 hover:bg-muted/40 last:border-0"
                    >
                      <TableCell className="py-6 pl-8 font-medium text-foreground transition-colors">
                        {item.service}
                      </TableCell>
                      <TableCell className="font-sans font-medium text-foreground">
                        {item.price}
                      </TableCell>
                      <TableCell className="pr-8 text-muted-foreground">
                        {item.includes}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-6 text-sm text-zinc-400 text-center">
              {tPricing("paymentPlanNote")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
