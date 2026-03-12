"use client"

import { motion } from "framer-motion"
import { Award, BookOpen } from "lucide-react"
import { useLocale } from "next-intl"
import { Footer } from "@/components/Footer"
import { PageBackButton } from "@/components/PageBackButton"
import { SectionIntro } from "@/components/SectionIntro"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { certificationsData } from "@/lib/legacy-data"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export default function CertificationsPage() {
  const locale = useLocale()
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto max-w-7xl px-6 pb-16 md:px-8 sm:pb-20">
        <motion.div {...fadeInUp}>
          <PageBackButton fallbackHref={`/${locale}`} label="Back to portfolio home" />
          <div className="mt-8">
            <SectionIntro
              eyebrow="Certifications & Awards"
              title="Credential archive"
              description="Supporting credentials, conference participation, and academic signals from the portfolio record."
              align="left"
            />
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificationsData.map((cert, index) => (
            <motion.div
              key={`${cert.title}-${cert.date}`}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.06 * index }}
            >
              <Card className="surface-premium h-full rounded-[2rem]">
                <CardContent className="p-6">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {cert.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {cert.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {cert.issuer}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {cert.date}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeInUp} className="mt-16">
          <Card className="surface-soft rounded-[2rem]">
            <CardContent className="p-6 sm:p-7">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="font-display text-4xl leading-none text-foreground">
                Continuous learning
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                These entries reinforce the broader story of sustained learning across physics,
                energy, research, and technical literacy. They are presented here as supporting
                context rather than as inflated credential marketing.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
