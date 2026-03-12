"use client"

import { motion } from "framer-motion"
import { BarChart3, Battery, BookOpen, Sparkles } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Footer } from "@/components/Footer"
import { PageBackButton } from "@/components/PageBackButton"
import { SectionIntro } from "@/components/SectionIntro"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { projectsData } from "@/lib/legacy-data"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export default function ProjectsPage() {
  const t = useTranslations("projects")
  const locale = useLocale()

  const featuredProjects = [
    {
      title: t("p1.title"),
      description: t("p1.description"),
      tags: t.raw("p1.tags") as string[],
      icon: BarChart3,
    },
    {
      title: t("p2.title"),
      description: t("p2.description"),
      tags: t.raw("p2.tags") as string[],
      icon: Battery,
    },
    {
      title: t("p3.title"),
      description: t("p3.description"),
      tags: t.raw("p3.tags") as string[],
      icon: Sparkles,
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto max-w-7xl px-6 pb-16 md:px-8 sm:pb-20">
        <motion.div {...fadeInUp}>
          <PageBackButton fallbackHref={`/${locale}#projects`} label="Back to project overview" />
          <div className="mt-8">
            <SectionIntro
              eyebrow="Projects & Work"
              title="Portfolio case studies"
              description="A mix of market-analysis work themes and academic research projects that show how Vidya approaches sector research, data interpretation, and technical problem solving."
              align="left"
            />
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredProjects.map((project, index) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.title}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.06 * index }}
              >
                <Card className="surface-premium h-full rounded-[2rem]">
                  <CardContent className="p-6">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {project.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div {...fadeInUp} className="mt-16">
          <Card className="surface-soft rounded-[2rem]">
            <CardContent className="p-6 sm:p-7">
              <div className="mb-8 max-w-2xl">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-display text-4xl leading-none text-foreground">
                  Academic and research projects
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  These entries come from the project archive already present in the repository and
                  show the underlying physics and materials-science base behind the current energy
                  market profile.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {projectsData.map((project) => (
                  <div
                    key={project.title}
                    className="rounded-[1.5rem] border border-border/70 bg-background p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {project.duration}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
