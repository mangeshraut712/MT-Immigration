"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/animations";
import { Ear, FileEdit, UserCheck } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Listen & Assess",
    description:
      "Start with a paid consultation to identify the issue, deadlines, and the cleanest next step.",
    highlight: "Attorney review of the facts you share",
    icon: Ear,
    features: [],
  },
  {
    id: "02",
    title: "Prepare & File",
    description:
      "Build the filing strategy, assemble supporting evidence, and prepare the submission with care.",
    highlight: "Tailored preparation for the filing that actually matters",
    icon: FileEdit,
    features: [],
  },
  {
    id: "03",
    title: "Guide You Through",
    description:
      "Stay prepared after filing with interview preparation, response strategy, and direct follow-up.",
    highlight: "Focused support through interviews, RFEs, and case changes",
    icon: UserCheck,
    features: [],
  },
];

export function ProcessSection() {
  const tProcess = useTranslations("process");
  const shouldReduceMotion = useReducedMotion();
  const translatedSteps = [
    {
      ...steps[0],
      title: tProcess("step1Title"),
      description: tProcess("step1Desc"),
      features: tProcess.raw("step1Features") as string[],
    },
    {
      ...steps[1],
      title: tProcess("step2Title"),
      description: tProcess("step2Desc"),
      features: tProcess.raw("step2Features") as string[],
    },
    {
      ...steps[2],
      title: tProcess("step3Title"),
      description: tProcess("step3Desc"),
      features: tProcess.raw("step3Features") as string[],
    },
  ];

  return (
    <section
      id="process"
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Solid Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={shouldReduceMotion ? {} : fadeUpVariants}
          className="max-w-3xl mb-12 md:mb-24 md:text-center md:mx-auto"
        >
          <div className="md:flex md:justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-border"></div>
              <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                {tProcess("title")}
              </span>
              <div className="hidden md:block h-px w-12 bg-border"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-4 md:mb-6 leading-[1.1]">
            {tProcess("heading").split(",")[0]},
            <br />
            <span className="text-muted-foreground italic">
              {tProcess("heading").split(",").slice(1).join(",").trim()}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mt-4 md:mt-6">
            {tProcess("subtitle")}
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainerVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Center Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-border" />

          {translatedSteps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={fadeUpVariants}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-16 mb-16 last:mb-0 ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
            >
              {/* Marker */}
              <div className="absolute left-0 md:left-1/2 w-14 h-14 -translate-x-0 md:-translate-x-1/2 flex items-center justify-center bg-background z-10 rounded-full border-4 border-border shadow-sm group hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 bg-muted text-foreground rounded-full flex items-center justify-center">
                  <step.icon size={16} />
                </div>
              </div>

              {/* Content Card */}
              <div
                className={`pl-20 md:pl-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}
              >
                <div
                  className={`p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative`}
                >
                  {/* Connecting Line (Mobile) */}
                  <div className="md:hidden absolute top-7 -left-6 w-6 h-px bg-border" />

                  <div className="mb-4 text-5xl font-serif text-muted font-bold select-none group-hover:text-border transition-colors">
                    {step.id}
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-muted-foreground font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="md:w-1/2" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
