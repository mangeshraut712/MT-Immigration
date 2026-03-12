import { dedupeBy } from "@/lib/collection-utils"

export const allSkillsData = {
  technical: dedupeBy([
    { name: "Laboratory Safety", level: 90 },
    { name: "Battery Management Systems", level: 85 },
    { name: "Quantitative Research", level: 88 },
    { name: "Microsoft Excel (Advanced)", level: 95 },
    { name: "PowerPoint", level: 92 },
    { name: "Data Analysis", level: 90 },
    { name: "Energy Audits", level: 80 },
    { name: "Solar System Design", level: 78 },
    { name: "Excel Dashboards", level: 95 },
    { name: "Power BI Automation", level: 85 },
    { name: "Solar PV Modelling", level: 75 }
  ], (skill) => skill.name),
  domain: dedupeBy([
    { name: "Energy Storage Markets", level: 90 },
    { name: "Solar PV Operations", level: 85 },
    { name: "Tariff Benchmarking", level: 88 },
    { name: "Hydrogen Technology", level: 75 },
    { name: "Policy Tracking", level: 85 },
    { name: "Competitive Benchmarking", level: 90 }
  ], (skill) => skill.name),
  soft: dedupeBy([
    { name: "Analytical Storytelling", level: 92 },
    { name: "Stakeholder Coaching", level: 85 },
    { name: "Cross-functional Collaboration", level: 90 },
    { name: "Mentorship & Training", level: 88 },
    { name: "Workshop Facilitation", level: 82 },
    { name: "Executive Communication", level: 90 }
  ], (skill) => skill.name),
  research: dedupeBy([
    { name: "Market Research", level: 95 },
    { name: "Project Management", level: 85 },
    { name: "Report Writing", level: 95 },
    { name: "Competitive Intelligence", level: 90 },
    { name: "Market Forecasting", level: 85 },
    { name: "Pricing Intelligence", level: 88 }
  ], (skill) => skill.name),
  professional: dedupeBy([
    { name: "Critical Thinking", level: 92 },
    { name: "Communication", level: 95 },
    { name: "Teamwork", level: 90 },
    { name: "Problem Solving", level: 92 },
    { name: "Analytical Skills", level: 95 },
    { name: "Presentation Skills", level: 93 },
    { name: "Client Engagement", level: 88 },
    { name: "Continuous Learning", level: 95 }
  ], (skill) => skill.name)
}

export const certificationsData = dedupeBy([
  {
    title: "International Conference",
    description: "Multifunctional & Hybrid Materials for Energy & Environment (MHMEE-2020)",
    issuer: "Y. C. College, Satara",
    date: "Jan 2020",
    icon: "🏆"
  },
  {
    title: "NCC Cadet",
    description: "Participated in CATC",
    issuer: "National Cadet Corps",
    date: "Aug 2014 & July 2015",
    icon: "🏆"
  },
  {
    title: "MS-CIT",
    description: "Maharashtra State Certificate in Information Technology",
    issuer: "MKCL",
    date: "Aug 2012",
    icon: "🏆"
  }
], (cert) => `${cert.title}-${cert.date}`)

export const projectsData = dedupeBy([
  {
    title: "Synthesis & Characterization of Fe3O4 Thin Films",
    description: "Used Chemical Bath Deposition Method to synthesize and characterize Fe3O4 thin films.",
    duration: "June 2019 - April 2020",
    tags: ["Physics", "Materials Science"],
    type: "research"
  },
  {
    title: "Formation of Core Losses of Different Magnetic Materials",
    description: "Studied core losses using transformer and hysteresis loop for various magnetic materials.",
    duration: "June 2016 - April 2017",
    tags: ["Physics", "Electrical"],
    type: "research"
  }
], (project) => `${project.title}-${project.duration}`)
