"use client"

import React from "react"
import { motion } from "framer-motion"

interface TimelineItem {
  type: "education" | "experience"
  date: string
  title: string
  subtitle: string
  description: string
  highlights?: string[]
  skills?: string[]
}

interface TimelineProps {
  items: TimelineItem[]
  title: string
  icon: React.ElementType
}

export function Timeline({ items, title, icon: Icon }: TimelineProps) {
  return (
    <div className="py-8 relative">
      {title ? (
        <div className="mb-14 flex items-center gap-4">
          <div className="flex shrink-0 items-center justify-center border border-border/60 bg-transparent p-3">
            <Icon className="h-5 w-5 text-foreground/80" />
          </div>
          <h2 className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {title}
          </h2>
        </div>
      ) : null}

      <div className="relative space-y-12 pl-6 md:pl-10">
        <div className="absolute left-[3px] md:left-3 top-2 bottom-0 w-px bg-border/50" />
        
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative flex flex-col group max-w-4xl"
          >
            <div className="absolute -left-[30px] md:-left-[43px] flex items-center justify-center w-[18px] h-[18px] rounded-full border border-foreground/30 bg-background shadow-xs shrink-0 z-10 transition-colors duration-300 group-hover:border-foreground" />
            
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-4">
              <h3 className="font-display text-2xl font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                {item.title}
              </h3>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                {item.date}
              </p>
            </div>
            
            <p className="text-[14px] font-medium text-foreground/80 mb-6 flex items-center gap-2 tracking-wide uppercase">
              {item.subtitle}
            </p>
            
            <div className="space-y-6">
              <p className="text-[15px] text-muted-foreground leading-relaxed font-light">
                {item.description}
              </p>

              {item.highlights && (
                <ul className="space-y-3">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-sm flex items-start text-muted-foreground font-light leading-relaxed">
                      <span className="mr-4 block mt-[10px] h-px w-3 bg-foreground/30 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.skills && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {item.skills.map((skill, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/70 border border-border/40 rounded-sm bg-secondary/20">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
