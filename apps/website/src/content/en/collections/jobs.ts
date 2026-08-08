/**
 * Collection: Jobs / Offene Positionen
 * --------------------------------------------------------------
 * Editierbar UND um neue Einträge erweiterbar (neben Testimonials die
 * einzige „anlegbare" Collection).
 * Strapi-Mapping: Collection Type `job`.
 * --------------------------------------------------------------
 */

export interface JobSection {
  /** Abschnitts-Überschrift, z. B. „Deine Aufgaben". */
  label: string;
  /** Stichpunkte des Abschnitts. */
  items: string[];
}

export interface Job {
  /** Stabile ID (Accordion-Item). */
  id: string;
  /** Stellentitel inkl. (m/w/d). */
  title: string;
  /** Kurz-Tags (Ort, Umfang, Start) — inkl. Emoji-Präfix. */
  tags: string[];
  /** Vorausgefüllter Bewerbungs-Mailto-Link. */
  mailto: string;
  /** Inhaltliche Abschnitte (Aufgaben, Profil, Benefits …). */
  sections: JobSection[];
}

export const jobs: Job[] = [
  {
    id: "item-1",
    title: "Internship Marketing & Project Management (m/f/d)",
    tags: ["📍 Remote/Munich", "💼 Full-time, 3–6 months", "🚀 Start anytime"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Praktikum Marketing & Projektmanagement",
    sections: [
      {
        label: "Your tasks",
        items: [
          "Content & SEO: keyword research, editorial planning, competitor and benchmark analysis, evaluation of statistics and real-time data",
          "Social media: planning and preparing LinkedIn and Instagram posts, community management, simple reporting",
          "Project management: contributing to kick-offs and workshops, coordinating timings and assets across Studio and Lab, quality assurance (QA)",
          "KPI tracking: monitoring traffic, leads, conversion rates and social engagement; monthly reports (e.g. Google Analytics/Looker)",
          "AI consulting & audit support: helping with AI-readiness checks, researching automation and AI tools",
        ],
      },
      {
        label: "Your profile",
        items: [
          "Enrolled student in marketing, media, business or similar; ideally a mandatory internship is possible",
          "First experience in marketing or project management is a plus, but not a must",
          "Strong interest in branding, AI tools and digital strategy; structured and reliable way of working",
          "Excellent German and English; team spirit",
        ],
      },
      {
        label: "What we offer",
        items: [
          "Onboarding & mentoring: structured digital onboarding, personal mentoring",
          "Development: internal sessions, language courses, regular coaching",
          "Flexibility: remote-first, flexible hours; office in Munich's creative quarter by arrangement",
          "Team spirit: after-work formats and team events; sports offers subject to availability",
          "Insight into both units: work on projects from Studio (brand & strategy) and Lab (web & automation)",
        ],
      },
    ],
  },
  {
    id: "item-2",
    title: "Sales & Business Development (m/f/d)",
    tags: ["📍 Remote/Munich", "💼 Full-time (permanent) or freelance", "🚀 Start asap"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Vertrieb & Business Development",
    sections: [
      {
        label: "Mission",
        items: [
          "Win new B2B clients across the DACH region and build long-term business relationships — around brand, technology and AI.",
        ],
      },
      {
        label: "Your tasks",
        items: [
          "New-business acquisition & outreach: identifying and approaching potential clients (B2B) via LinkedIn, email, phone and events",
          "Consulting & needs analysis: leading first conversations, understanding requirements, positioning the right configuration of our AI department",
          "Proposals & pitches: creating proposals, presentations and pitch decks in close coordination with the team",
          "Pipeline management: maintaining and steering the sales pipeline in the CRM; forecasting & reporting",
          "Partnerships & network: building strategic partnerships; attending industry events and meetups",
        ],
      },
      {
        label: "Your profile",
        items: [
          "≥2 years of experience in B2B sales, ideally in an agency, SaaS or tech environment",
          "Strong communication and negotiation skills; confident presence in client conversations",
          "An understanding of digital products, branding or AI solutions — no deep technical knowledge required",
          "Initiative, closing strength and CRM experience (e.g. HubSpot, Pipedrive)",
          "Excellent German (C2) and good English; a DACH network is a plus",
        ],
      },
      {
        label: "What we offer",
        items: [
          "Remote-first & flex-time: flexible hours, remote/hybrid possible",
          "Attractive compensation: base salary + performance-based commission; fair terms for freelancers",
          "Modern environment: innovative product portfolio, short decision paths, direct line to leadership",
          "Development: sales training, AI updates and access to modern tools & stacks",
          "Growth potential: help shape the sales strategy in a growing agency",
        ],
      },
    ],
  },
  {
    id: "item-3",
    title: "Internship Sales & Business Development (m/f/d)",
    tags: ["📍 Remote/Munich", "💼 Full-time, 3–6 months", "🚀 Start anytime"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Praktikum Vertrieb & Business Development",
    sections: [
      {
        label: "Your tasks",
        items: [
          "Lead research & prospecting: identifying potential B2B clients, researching industries, companies and contacts",
          "Outreach support: preparing email sequences, LinkedIn messages and conversation guides",
          "CRM maintenance: creating contact records, pipeline updates, simple reporting and analysis",
          "Pitch preparation: contributing to presentations, proposals and case-study write-ups for Studio & Lab",
          "Market & competitor analysis: tracking trends in the agency and AI market, preparing insights",
        ],
      },
      {
        label: "Your profile",
        items: [
          "Enrolled student in business administration, marketing, communications or similar; ideally a mandatory internship is possible",
          "Interest in sales, client relationships and digital business models",
          "Strong communication, initiative and a structured way of working",
          "Excellent German (C1+) and good English; first CRM experience is a plus",
        ],
      },
      {
        label: "What we offer",
        items: [
          "Onboarding & mentoring: structured onboarding, personal guidance from experienced salespeople",
          "Hands-on insight: real client projects, sales calls and pitch situations from day one",
          "Flexibility: remote-first, flexible hours; office in Munich by arrangement",
          "Team spirit: after-work formats, team events and an open feedback culture",
          "Career perspective: a permanent position is possible with strong performance",
        ],
      },
    ],
  },
  {
    id: "item-4",
    title: "Working Student – DevOps & Full-Stack (m/f/d)",
    tags: ["📍 Remote/Munich", "💼 12–20 h/week", "🚀 Flexible start"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Werkstudent:in DevOps & Full-Stack",
    sections: [
      {
        label: "Your tasks",
        items: [
          "CI/CD & containers: helping build and maintain pipelines; container builds; dev/test environments",
          "Full-stack development: smaller features in internal tools and client dashboards (frontend: Next.js/React; backend: Node/TypeScript), API integrations",
          "Databases & integrations: Postgres; working with REST, SQL, ETL",
          "Automations & scripts: n8n workflows, scripts (TypeScript)",
          "QA & documentation: tests, docs, clean deliverables",
        ],
      },
      {
        label: "Your profile",
        items: [
          "Enrolled student in (business) informatics or similar; ideally from the 3rd semester onwards",
          "First programming experience with JavaScript/TypeScript; interest in full-stack and software architecture",
          "Solid Git skills; basic cloud and Docker knowledge; excellent German (C1); independent & structured; curious about AI/automation",
          "Nice-to-have: Prisma, Tailwind, Postgres, Auth/OAuth, vector DBs",
        ],
      },
      {
        label: "What we offer",
        items: [
          "Mentoring & feedback: close guidance from experienced developers, regular 1:1s",
          "Practically relevant projects: real client and product use cases with social impact",
          "Flexibility: remote options, flexible hours; compatible with your studies",
          "Team spirit: small, supportive team; structured onboarding and clear roadmaps",
          "Lab access: insight into production AI stacks and modern toolchains",
        ],
      },
    ],
  },
];
