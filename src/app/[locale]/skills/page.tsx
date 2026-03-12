"use client"

import { motion } from "framer-motion"
import { BarChart3, Battery, Briefcase, Lightbulb } from "lucide-react"
import { useLocale } from "next-intl"
import { Footer } from "@/components/Footer"
import { PageBackButton } from "@/components/PageBackButton"
import { SectionIntro } from "@/components/SectionIntro"
import { Card, CardContent } from "@/components/ui/card"
import { allSkillsData } from "@/lib/legacy-data"

const skillGroups = [
  {
    title: "Technical Foundations",
    description: "Tools and technical capabilities used in research, lab support, and reporting.",
    items: allSkillsData.technical,
    icon: Battery,
  },
  {
    title: "Energy & Market Domain",
    description: "Sector knowledge across storage, solar, policy, and pricing intelligence.",
    items: allSkillsData.domain,
    icon: BarChart3,
  },
  {
    title: "Research & Strategy",
    description: "Research methods, forecasting, competitive intelligence, and synthesis.",
    items: allSkillsData.research,
    icon: Lightbulb,
  },
  {
    title: "Professional Strengths",
    description: "Communication, leadership, and execution strengths that improve delivery quality.",
    items: allSkillsData.professional,
    icon: Briefcase,
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export default function SkillsPage() {
  const locale = useLocale()
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto max-w-7xl px-6 pb-16 md:px-8 sm:pb-20">
        <motion.div {...fadeInUp}>
          <PageBackButton fallbackHref={`/${locale}#skills`} label="Back to skills overview" />
          <div className="mt-8">
            <SectionIntro
              eyebrow="Skills & Expertise"
              title="Capability map"
              description="A practical mix of market research, energy-sector understanding, analytical tooling, and communication strength built through research, lab work, and analyst roles."
              align="center"
            />
          </div>
        </motion.div>

        <div className="grid gap-6">
          {skillGroups.map((group, index) => {
            const Icon = group.icon
            return (
              <motion.div
                key={group.title}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.06 * index }}
              >
                <Card className="surface-premium rounded-[2rem]">
                  <CardContent className="p-6 sm:p-7">
                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                      <div>
                        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                          {group.title}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                          {group.description}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {group.items.map((skill) => (
                          <div
                            key={skill.name}
                            className="rounded-[1.5rem] border border-border/70 bg-background p-4"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <h3 className="text-sm font-semibold text-foreground">{skill.name}</h3>
                              <span className="text-xs font-medium text-primary">{skill.level}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
      <Footer />
    </div>
  )
}
