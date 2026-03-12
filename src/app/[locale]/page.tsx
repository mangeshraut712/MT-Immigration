"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Award,
  Briefcase,
  Download,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { assistantAgents } from "@/lib/assistant-agents"
import { dedupeBy } from "@/lib/collection-utils"
import { certificationsData } from "@/lib/legacy-data"
import { contactInfo } from "@/lib/data"
import { Footer } from "@/components/Footer"
import { Game } from "@/components/Game"
import { SectionIntro } from "@/components/SectionIntro"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Timeline } from "@/components/Timeline"

interface TimelineItem {
  type: "education" | "experience"
  date: string
  title: string
  subtitle: string
  description: string
  highlights?: string[]
  skills?: string[]
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export default function PortfolioPage() {
  const t = useTranslations()
  const locale = useLocale()
  const homepageAgents = dedupeBy(assistantAgents, (agent) => agent.id).sort(
    (left, right) => left.sortOrder - right.sortOrder
  )

  const experienceData: TimelineItem[] = [
    {
      type: "experience",
      title: t("experience.analyst.title"),
      subtitle: t("experience.analyst.subtitle"),
      date: t("experience.analyst.date"),
      description: t("experience.analyst.description"),
      highlights: t.raw("experience.analyst.highlights") as string[],
      skills: t.raw("experience.analyst.skills") as string[],
    },
    {
      type: "experience",
      title: t("experience.intern.title"),
      subtitle: t("experience.intern.subtitle"),
      date: t("experience.intern.date"),
      description: t("experience.intern.description"),
      highlights: t.raw("experience.intern.highlights") as string[],
      skills: t.raw("experience.intern.skills") as string[],
    },
    {
      type: "experience",
      title: t("experience.dataAnalyst.title"),
      subtitle: t("experience.dataAnalyst.subtitle"),
      date: t("experience.dataAnalyst.date"),
      description: t("experience.dataAnalyst.description"),
      highlights: t.raw("experience.dataAnalyst.highlights") as string[],
      skills: t.raw("experience.dataAnalyst.skills") as string[],
    },
    {
      type: "experience",
      title: t("experience.teacher.title"),
      subtitle: t("experience.teacher.subtitle"),
      date: t("experience.teacher.date"),
      description: t("experience.teacher.description"),
      highlights: t.raw("experience.teacher.highlights") as string[],
      skills: t.raw("experience.teacher.skills") as string[],
    },
  ]

  const educationData: TimelineItem[] = [
    {
      type: "education",
      title: t("education.mtech.title"),
      subtitle: t("education.mtech.subtitle"),
      date: t("education.mtech.date"),
      description: t("education.mtech.description"),
    },
    {
      type: "education",
      title: t("education.bed.title"),
      subtitle: t("education.bed.subtitle"),
      date: t("education.bed.date"),
      description: t("education.bed.description"),
    },
    {
      type: "education",
      title: t("education.msc.title"),
      subtitle: t("education.msc.subtitle"),
      date: t("education.msc.date"),
      description: t("education.msc.description"),
    },
    {
      type: "education",
      title: t("education.bsc.title"),
      subtitle: t("education.bsc.subtitle"),
      date: t("education.bsc.date"),
      description: t("education.bsc.description"),
    },
  ]

  const metrics = [
    { value: "4+", label: t("home.metrics.experience") },
    { value: "500+", label: t("home.metrics.reports") },
    { value: "200+", label: t("home.metrics.tests") },
  ]

  const strengths = t.raw("home.strengths") as string[]
  const projects = [
    {
      title: t("projects.p1.title"),
      description: t("projects.p1.description"),
      tags: t.raw("projects.p1.tags") as string[],
    },
    {
      title: t("projects.p2.title"),
      description: t("projects.p2.description"),
      tags: t.raw("projects.p2.tags") as string[],
    },
    {
      title: t("projects.p3.title"),
      description: t("projects.p3.description"),
      tags: t.raw("projects.p3.tags") as string[],
    },
  ]

  const openAgentConversation = (agent: (typeof assistantAgents)[number]) => {
    window.dispatchEvent(
      new CustomEvent("portfolio-chat:open", {
        detail: {
          agent: agent.id,
          draft: agent.starterPrompt,
        },
      })
    )
  }

  return (
    <div className="overflow-x-hidden bg-background">
      <main>
        <section
          id="home"
          className="relative scroll-mt-24 overflow-hidden border-b border-border/40 bg-background"
        >
          <div className="container relative mx-auto grid gap-10 px-6 pb-16 pt-24 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:items-center lg:gap-12 lg:pb-20 lg:pt-32">
            <motion.div {...fadeInUp} className="max-w-2xl z-10">
              <h1 className="font-display max-w-4xl text-balance text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                {t("hero.name")}
              </h1>
              <p className="mt-6 md:mt-8 max-w-2xl text-balance text-xl leading-8 text-foreground/80 sm:text-2xl font-light tracking-wide">
                {t("hero.title")}
              </p>
              <p className="mt-4 md:mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="rounded-md border border-border bg-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground/80">
                  Energy storage & power markets
                </span>
                <span className="rounded-md border border-border bg-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground/80">
                  Market intelligence & dashboards
                </span>
                <span className="rounded-md border border-border bg-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground/80">
                  M.Tech in Energy Technology
                </span>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-none bg-foreground px-10 text-background hover:bg-foreground/90 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] h-14 text-sm tracking-wide font-medium"
                >
                  <a href={`mailto:${contactInfo.email}`}>
                    <Mail className="mr-2.5 h-4 w-4" />
                    {t("home.primaryCta")}
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-none border-border bg-background px-10 hover:bg-secondary hover:border-foreground/20 transition-all h-14 text-sm tracking-wide font-medium"
                >
                  <a href="/Vidya_Raut_Resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2.5 h-4 w-4" />
                    {t("hero.downloadResume")}
                  </a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-[13px] tracking-wide text-muted-foreground uppercase">
                <div className="inline-flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-foreground/60" />
                  <span>
                    {t("home.locationLabel")}: {contactInfo.location}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-foreground/60" />
                  <span>{t("home.focusLabel")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.15 }}
              className="relative mx-auto w-full max-w-[460px] lg:ml-auto"
            >
              <div className="relative group">
                {/* Minimalist shadow for depth, not glowing blur */}
                <div className="absolute -inset-4 md:-inset-6 bg-border/5 scale-95 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:scale-100" />
                
                {/* Sophisticated editorial frame */}
                <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-secondary w-full object-cover">
                  {/* The inner frame border */}
                  <div className="absolute inset-x-2 md:inset-x-4 inset-y-2 md:inset-y-4 border border-foreground/10 z-20 pointer-events-none" />
                  
                  <Image
                    src="/home picture.jpeg"
                    alt="Vidya Raut"
                    fill
                    className="object-cover object-[center_top] scale-100 transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Simple refined vignette gradient at bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-black p-6 sm:p-8 pt-6 text-white z-10">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 mb-3">
                       {t("home.snapshotTitle")}
                    </p>
                    <p className="text-sm leading-relaxed text-white max-w-[280px] font-light">
                      {t("home.snapshotBody")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {metrics.slice(0, 2).map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.15) }}
                      className="bg-background border border-border px-5 py-4 min-w-[140px] flex flex-col items-start gap-1"
                    >
                      <span className="font-display text-3xl text-foreground">
                        {metric.value}
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {metric.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="container relative mx-auto border-t border-border/40 px-6 pb-16 pt-8 md:px-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="grid gap-10 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] items-start">
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4">
                    {t("home.strengthsTitle")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("home.strengthsDescription")}
                  </p>
                </div>
                <ul className="flex flex-wrap gap-3">
                  {strengths.map((strength) => (
                    <li
                      key={strength}
                      className="border border-border bg-background px-6 py-3 text-sm font-medium leading-tight text-foreground transition-colors hover:border-foreground/30 hover:bg-secondary"
                    >
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="relative scroll-mt-24 py-16 sm:py-24">
          <div className="absolute inset-0 bg-background -z-10" />
          <div className="container relative mx-auto px-4">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow={t("skills.title")}
                title={t("home.expertiseTitle")}
                description={t("skills.description")}
                align="center"
              />
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.1 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
            >
              <ExpertiseCard
                title={t("skills.marketAnalysis.title")}
                items={t.raw("skills.marketAnalysis.items") as string[]}
              />
              <ExpertiseCard
                title={t("skills.energyTech.title")}
                items={t.raw("skills.energyTech.items") as string[]}
              />
              <ExpertiseCard
                title={t("skills.dataTools.title")}
                items={t.raw("skills.dataTools.items") as string[]}
              />
              <ExpertiseCard
                title={t("skills.technical.title")}
                items={t.raw("skills.technical.items") as string[]}
              />
            </motion.div>
          </div>
        </section>

        <section id="projects" className="relative scroll-mt-24 py-16 sm:py-24 border-b border-border/40 bg-background">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow={t("projects.title")}
                title={t("home.projectsHeading")}
                description={t("projects.description")}
                align="left"
              />
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="h-full border border-border/70 bg-background p-8 sm:p-10 transition-all duration-500 hover:border-foreground/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] select-none">
                    <div className="flex flex-col h-full">
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                        Project 0{index + 1}
                      </p>
                      <h3 className="mt-6 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground font-light">
                        {project.description}
                      </p>
                      <div className="mt-10 flex flex-wrap gap-2.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary/50 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/80 border border-border/40 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeInUp} className="mt-16 sm:mt-20 flex justify-center lg:justify-end">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-none px-10 border-foreground/20 bg-transparent hover:bg-foreground hover:text-background transition-all font-medium text-foreground h-14 tracking-wide text-sm"
              >
                <Link href={`/${locale}/projects`}>
                  Explore all projects
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section id="agents" className="relative scroll-mt-24 py-16 sm:py-24">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow="AI Agent Desk"
                title="A more helpful portfolio, not just a static one."
                description="Three specialist agents help recruiters, customers, and energy-sector visitors explore Vidya’s work, understand energy markets, and map her skills to real project needs. When OpenAI is configured, the market agent can use the newer Responses API path and live web-search tools for current market questions."
                align="left"
              />
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {homepageAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: 0.1 * index }}
                >
                  <div className="h-full border border-border/60 bg-background p-8 sm:p-10 transition-all duration-300 hover:border-foreground/20">
                    <div className="mb-8 inline-flex h-12 w-12 items-center justify-center border border-border/40 text-foreground">
                      <Sparkles className="h-5 w-5 opacity-70" />
                    </div>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-foreground">
                      {agent.homepageTitle}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground font-light">
                      {agent.homepageSummary}
                    </p>
                    <ul className="mt-8 grid gap-4 border-t border-border/40 pt-8">
                      {agent.capabilityBullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start text-sm leading-relaxed text-foreground/80 font-light"
                        >
                          <span className="mr-3 block mt-2 h-px w-2 bg-foreground/40 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      className="mt-10 rounded-none w-full border-border/70 hover:bg-secondary/50 hover:border-foreground/30 transition-all font-medium uppercase tracking-widest text-[11px] h-12"
                      onClick={() => openAgentConversation(agent)}
                    >
                      Launch {agent.shortName}
                      <ArrowRight className="ml-3 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        <section className="relative py-16 sm:py-24 bg-background border-t border-border/40">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow="Credentials & Research"
                title="Proof points beyond the timeline."
                description="Academic milestones, conference participation, and certification-style credentials that reinforce Vidya’s analytical and technical foundation."
                align="center"
              />
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {certificationsData.map((cert, index) => (
                <motion.div
                  key={`${cert.title}-${cert.date}`}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: 0.1 * index }}
                >
                  <div className="h-full border border-border/60 bg-background p-8 transition-colors hover:border-foreground/20 text-center sm:text-left">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center border border-border/50 text-foreground/70 sm:mx-0 mx-auto">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-medium tracking-tight text-foreground">
                      {cert.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-light">
                      {cert.description}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 sm:justify-start justify-center">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70 border-b border-border/60 pb-1">
                        {cert.issuer}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70 border-b border-border/60 pb-1">
                        {cert.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 py-16 sm:py-24">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow={t("experience.title")}
                title={t("experience.title")}
                description={t("home.experienceNote")}
                align="left"
                className="mb-12"
              />
            </motion.div>
            <Timeline
              items={experienceData}
              title=""
              icon={Briefcase}
            />
          </div>
        </section>

        <section id="education" className="scroll-mt-24 py-16 sm:py-24 bg-background border-t border-border/40">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow={t("education.title")}
                title={t("education.title")}
                description={t("home.educationNote")}
                align="left"
                className="mb-12"
              />
            </motion.div>
            <Timeline
              items={educationData}
              title=""
              icon={GraduationCap}
            />
          </div>
        </section>

        <section id="contact" className="relative scroll-mt-24 border-t border-border/40 bg-background py-16 sm:py-24 text-foreground">
          <div className="container relative mx-auto px-6 md:px-8 text-center max-w-4xl">
            <motion.div {...fadeInUp}>
              <SectionIntro
                eyebrow={t("contact.title")}
                title="Ready to optimize your next project?"
                description={t("contact.description")}
                align="center"
              />
              <Card className="rounded-[2rem] border-border bg-card shadow-sm">
                <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {t("contact.infoTitle")}
                      </p>
                      <p className="text-base leading-7 text-foreground/80">
                        {t("home.contactNote")}
                      </p>
                    </div>

                    <div className="grid gap-3 text-sm text-foreground/80">
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 hover:border-primary/35 hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        {contactInfo.email}
                      </a>
                      <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
                        <MapPin className="h-4 w-4" />
                        {contactInfo.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:flex-col">
                    <Button asChild className="rounded-full">
                      <a href={`mailto:${contactInfo.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        {t("home.primaryCta")}
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full">
                      <a
                        href={contactInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Game />
      </main>

      <Footer />
    </div>
  )
}
function ExpertiseCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-border/60 pt-6 mt-4">
      <h3 className="font-display text-2xl font-medium tracking-tight text-foreground mb-6">
        {title}
      </h3>
      <ul className="grid gap-3 flex-wrap">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center text-[14px] leading-relaxed text-muted-foreground font-light tracking-wide before:content-[''] before:block before:w-1.5 before:h-px before:bg-foreground/40 before:mr-3"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
