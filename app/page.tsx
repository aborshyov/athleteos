"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  Check,
  Copy,
  Eraser,
  Github,
  Handshake,
  Linkedin,
  Mail,
  Map,
  Medal,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wand2,
  Zap,
} from "lucide-react";

const athleteProfiles = [
  {
    sport: "Hockey",
    name: "Demo Athlete",
    summary: "Right wing | NCAA hockey | 4-year starter",
    background: "Division I Hockey | Assistant Captain | Finance major",
    target: "AI / Finance / Ops",
    location: "Remote + NYC",
    stats: [
      ["92", "Leadership"],
      ["88", "Analysis"],
      ["95", "Discipline"],
    ],
    strengths: ["Leadership", "Risk discipline", "Data habits", "Coachability", "Client presence", "Operating rhythm"],
  },
  {
    sport: "Basketball",
    name: "Demo Athlete",
    summary: "Point guard | Pro experience | Team captain",
    background: "Professional Basketball | Floor General | Analytics focus",
    target: "Sales / Customer Success",
    location: "Remote + Chicago",
    stats: [
      ["94", "Presence"],
      ["86", "Strategy"],
      ["91", "Resilience"],
    ],
    strengths: ["Communication", "Teamwork", "Adaptability", "Client presence", "Fast decisions", "Resilience"],
  },
  {
    sport: "Soccer",
    name: "Demo Athlete",
    summary: "Midfielder | International athlete | Operations mindset",
    background: "International Soccer | Midfield Lead | Business major",
    target: "Operations / Analytics",
    location: "Remote + Boston",
    stats: [
      ["90", "Systems"],
      ["89", "Analytics"],
      ["93", "Teamwork"],
    ],
    strengths: ["Pattern recognition", "Teamwork", "Adaptability", "Execution", "Planning", "Pressure management"],
  },
];

const trustBadges = ["NCAA Athletes", "Professional Athletes", "International Athletes", "Remote Careers"];

const careerPaths = [
  {
    category: "AI Operations",
    role: "AI Operations Analyst",
    match: 94,
    salary: "$82k-$118k",
    remote: true,
    why: "Athletes already review performance data, identify patterns, and adjust quickly. That maps well to model QA, workflow design, and human-in-the-loop operations.",
  },
  {
    category: "Business Operations",
    role: "Revenue Operations Coordinator",
    match: 88,
    salary: "$68k-$96k",
    remote: true,
    why: "Practice planning, role clarity, and scoreboard discipline translate into process improvement, forecasting, and cross-functional execution.",
  },
  {
    category: "Finance",
    role: "Financial Services Associate",
    match: 86,
    salary: "$74k-$105k",
    remote: false,
    why: "Athletes bring trust, discipline, preparation, and composure under pressure, all useful in client-facing financial services roles.",
  },
  {
    category: "Sales",
    role: "Account Executive",
    match: 84,
    salary: "$78k-$140k",
    remote: true,
    why: "Competitive drive, repetition, feedback tolerance, and relationship building make athletes strong candidates for modern sales teams.",
  },
  {
    category: "Sports Business",
    role: "Partnerships Coordinator",
    match: 90,
    salary: "$62k-$92k",
    remote: false,
    why: "Athletes understand team culture, fan engagement, sponsorship value, and the operating reality behind sports organizations.",
  },
  {
    category: "Coaching",
    role: "Player Development Specialist",
    match: 92,
    salary: "$58k-$88k",
    remote: false,
    why: "Leadership, feedback delivery, mentorship, and performance planning are direct extensions of the athlete experience.",
  },
  {
    category: "Analytics",
    role: "Performance Data Analyst",
    match: 82,
    salary: "$76k-$112k",
    remote: true,
    why: "Film study, opponent scouting, and game-plan adjustments are practical analytical behaviors that can grow into data roles.",
  },
  {
    category: "Customer Success",
    role: "Customer Success Manager",
    match: 87,
    salary: "$72k-$110k",
    remote: true,
    why: "Athletes are trained to communicate clearly, earn trust, manage pressure, and keep teams aligned around outcomes.",
  },
];

const translatedBullets = [
  {
    from: "Assistant captain for a Division I hockey program.",
    to: "Led peer accountability and communication for a 28-person high-performance team, aligning daily preparation, feedback loops, and performance standards in a pressure-driven environment.",
  },
  {
    from: "Studied opponents and adjusted game plans.",
    to: "Converted competitive intelligence into tactical recommendations using pattern recognition, video review, and performance metrics to improve execution quality.",
  },
  {
    from: "Balanced travel, training, school, and recovery.",
    to: "Managed a demanding operating cadence across competing priorities while maintaining consistent preparation, resilience, and measurable performance standards.",
  },
];

const translatorExamples = [
  "Led offseason training sessions for younger teammates.",
  "Studied opponent power plays and shared adjustments with coaches.",
  "Balanced travel, practice, recovery, and finance coursework.",
];

const athleteBusinessTraits = [
  {
    title: "Leadership",
    icon: Users,
    text: "Athletes learn how to set standards, create trust, and move groups toward a shared outcome.",
  },
  {
    title: "Discipline",
    icon: Target,
    text: "Daily preparation, repetition, and feedback cycles become reliable execution in business settings.",
  },
  {
    title: "Resilience",
    icon: ShieldCheck,
    text: "Athletes recover from setbacks quickly and keep performing when stakes, scrutiny, and ambiguity rise.",
  },
  {
    title: "Adaptability",
    icon: Zap,
    text: "Game situations change fast. That same adjustment speed helps in startups, sales, operations, and AI work.",
  },
  {
    title: "Pressure management",
    icon: Activity,
    text: "Athletes are used to making decisions when the clock, crowd, and scoreboard all matter.",
  },
  {
    title: "Teamwork",
    icon: Handshake,
    text: "Role clarity, communication, and accountability are natural habits from team environments.",
  },
  {
    title: "Analytical thinking",
    icon: Brain,
    text: "Film review and performance tracking build a practical foundation for data-informed decisions.",
  },
];

const fitStrengthBank = ["Leadership", "Coachability", "Operating rhythm", "Client presence", "Pressure management", "Cross-functional teamwork"];

function generateBusinessBullet(input: string) {
  const cleanInput = input.trim().replace(/\s+/g, " ");
  const normalizedInput = cleanInput.toLowerCase();

  if (!cleanInput) {
    return "Led high-performance team execution by translating athletic discipline, preparation habits, and pressure-tested communication into measurable operating outcomes.";
  }

  if (normalizedInput.includes("captain") || normalizedInput.includes("lead") || normalizedInput.includes("mentor")) {
    return `Led team accountability through ${cleanInput}, strengthening communication, role clarity, and performance standards across a high-pressure environment.`;
  }

  if (normalizedInput.includes("film") || normalizedInput.includes("opponent") || normalizedInput.includes("scout") || normalizedInput.includes("game plan")) {
    return `Analyzed competitive patterns from ${cleanInput}, converting performance insights into tactical recommendations, decision support, and measurable execution improvements.`;
  }

  if (normalizedInput.includes("practice") || normalizedInput.includes("train") || normalizedInput.includes("workout") || normalizedInput.includes("development")) {
    return `Managed a structured development cadence through ${cleanInput}, improving preparation quality, consistency, and long-term performance habits.`;
  }

  if (normalizedInput.includes("travel") || normalizedInput.includes("school") || normalizedInput.includes("balance") || normalizedInput.includes("coursework")) {
    return `Coordinated competing priorities across ${cleanInput}, demonstrating time management, resilience, and reliable execution under demanding schedule pressure.`;
  }

  if (normalizedInput.includes("community") || normalizedInput.includes("fan") || normalizedInput.includes("sponsor")) {
    return `Represented team values through ${cleanInput}, building stakeholder trust, communication quality, and a professional brand presence.`;
  }

  return `Translated experience in ${cleanInput} into business-ready strengths in execution, collaboration, adaptability, and performance under pressure.`;
}

function analyzeFit(jobTitle: string, skillsText: string) {
  const combined = `${jobTitle} ${skillsText}`.toLowerCase();
  const keywordGroups = {
    ai: ["ai", "automation", "model", "workflow", "data", "qa", "analytics"],
    finance: ["finance", "financial", "portfolio", "risk", "excel", "valuation", "client"],
    operations: ["operations", "process", "systems", "project", "workflow", "forecast", "planning"],
    sales: ["sales", "revenue", "account", "crm", "pipeline", "customer", "relationship"],
  };

  const matches = Object.values(keywordGroups).flat().filter((keyword) => combined.includes(keyword));
  const uniqueMatches = new Set(matches);
  const score = Math.min(97, 72 + uniqueMatches.size * 4 + (combined.includes("lead") ? 5 : 0));

  const strengths = fitStrengthBank.filter((strength) => {
    const lower = strength.toLowerCase();
    return combined.includes(lower.split(" ")[0]) || ["Leadership", "Coachability", "Pressure management"].includes(strength);
  }).slice(0, 4);

  const missingSkills = [
    combined.includes("ai") ? null : "AI workflow vocabulary",
    combined.includes("data") || combined.includes("analytics") ? null : "Data storytelling",
    combined.includes("finance") ? null : "Business finance fundamentals",
    combined.includes("crm") || combined.includes("customer") ? null : "CRM or customer lifecycle tools",
  ].filter(Boolean) as string[];

  const recommendedPaths = careerPaths
    .filter((path) => {
      const category = path.category.toLowerCase();
      return combined.includes(category.split(" ")[0]) || combined.includes(path.role.toLowerCase().split(" ")[0]);
    })
    .slice(0, 3);

  return {
    score,
    strengths: strengths.length ? strengths : fitStrengthBank.slice(0, 3),
    missingSkills: missingSkills.slice(0, 3),
    recommendedPaths: recommendedPaths.length ? recommendedPaths : careerPaths.slice(0, 3),
  };
}

function generateOutreachMessage(recipientRole: string, tone: string, goal: string, variation: number) {
  const role = recipientRole.trim() || "AI operations leader";
  const opener =
    tone === "Direct"
      ? "I am reaching out because your work is closely aligned with the career path I am pursuing."
      : tone === "Warm"
        ? "Your career path stood out because it connects practical execution with the type of transition I am working toward."
        : "I came across your profile and appreciated the way your work bridges strategy, execution, and career growth.";
  const ask =
    goal === "Advice call"
      ? "Would you be open to a 15-minute advice call?"
      : goal === "Referral conversation"
        ? "If there is a relevant role or team, I would appreciate your perspective on how to position my background."
        : "I would value any guidance on the skills and proof points that matter most for this path.";
  const proof =
    variation % 2 === 0
      ? "I am translating elite sports experience into business strengths like leadership, discipline, resilience, and analytical preparation."
      : "My background as a competitive athlete has trained me to prepare deeply, communicate clearly, and perform under pressure.";

  return `Hi, I am a former athlete exploring a transition into work connected to ${role}. ${opener} ${proof} ${ask}`;
}

function copyToClipboard(text: string, onDone: () => void) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  void navigator.clipboard.writeText(text).then(onDone).catch(() => undefined);
}

export default function Home() {
  const [profileIndex, setProfileIndex] = useState(0);
  const activeProfile = athleteProfiles[profileIndex];

  return (
    <main className="min-h-screen bg-[var(--color-page)] text-[var(--color-navy)]">
      <Header />
      <Hero profile={activeProfile} />

      <section id="demo" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[var(--color-border)] pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--color-green)]">Interactive MVP</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-navy)] sm:text-4xl">
              Career transition workspace
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-muted)]">
              A simple local dashboard that helps athletes turn experience into stronger positioning, better-fit roles, and warmer conversations.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["8", "Career paths"],
              ["91%", "Demo fit"],
              ["3", "Tools"],
            ].map(([value, label]) => (
              <div key={label} className="premium-stat rounded-md px-4 py-3.5">
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-sm text-[var(--color-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-8">
            <ProfileCard profile={activeProfile} profileIndex={profileIndex} onProfileChange={setProfileIndex} />
            <JobFitScorer />
          </aside>

          <div className="space-y-8">
            <CareerRecommender />
            <ResumeTranslator />
            <OutreachGenerator />
          </div>
        </div>
      </section>

      <AthleteSuccessSection />
      <AboutSection />
      <Footer />
    </main>
  );
}

function Header() {
  const navItems = [
    ["Home", "#home"],
    ["Features", "#features"],
    ["Demo", "#demo"],
    ["About", "#about"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[rgba(247,246,239,0.82)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8" aria-label="Primary navigation">
        <a href="#home" className="group flex items-center gap-3 rounded-md outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)]">
          <span className="flex size-10 items-center justify-center rounded-lg bg-[var(--color-navy)] text-white shadow-lg shadow-slate-900/15 transition group-hover:-translate-y-0.5">
            <Trophy size={20} aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">AthleteOS</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)]"
            >
              {label}
            </a>
          ))}
        </div>

        <a href="#translator" className="btn-primary !px-4 !py-2">
          Get Started
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

function Hero({ profile }: { profile: (typeof athleteProfiles)[number] }) {
  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="hero-grid" aria-hidden="true" />
      <div className="accent-line accent-line-one" aria-hidden="true" />
      <div className="accent-line accent-line-two" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/85 px-3 py-1.5 text-sm font-semibold text-[var(--color-green)] shadow-sm">
            <Sparkles size={15} aria-hidden="true" />
            Career intelligence for competitive athletes
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-[var(--color-navy)] sm:text-6xl lg:text-7xl">
            AthleteOS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl sm:leading-9">
            Translate sports experience into credible job paths, resume bullets, fit scores, and outreach across AI, tech, finance, operations, sales, coaching, sports business, and remote work.
          </p>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[var(--color-green)]">
            Built for NCAA, professional, international, and former athletes navigating career transitions.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a className="btn-primary" href="#recommender">
              Explore paths
              <Map size={18} aria-hidden="true" />
            </a>
            <a className="btn-secondary" href="#translator">
              Translate resume
              <Wand2 size={18} aria-hidden="true" />
            </a>
            <a className="btn-ghost" href="#demo">
              See athlete demo
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-2.5" aria-label="AthleteOS supports these audiences">
            {trustBadges.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] shadow-sm">
                <BadgeCheck size={14} className="text-[var(--color-green)]" aria-hidden="true" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-xl border border-white bg-white/85 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="rounded-lg bg-[linear-gradient(135deg,#111827,#203044)] p-6 text-white">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm text-slate-200">Demo Athlete</p>
                <h2 className="mt-1 text-2xl font-semibold">{profile.name}</h2>
                <p className="mt-2 text-slate-200">{profile.background}</p>
              </div>
              <Medal className="shrink-0 text-[#d6c47c]" size={34} aria-hidden="true" />
            </div>
            <div className="mt-9 grid grid-cols-3 gap-3">
              {profile.stats.map(([score, label]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/10 p-3.5">
                  <p className="text-2xl font-semibold">{score}</p>
                  <p className="mt-1 text-xs text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {profile.strengths.map((skill) => (
              <div key={skill} className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-2 text-sm font-medium text-[var(--color-navy)]">
                <Check size={15} className="text-[var(--color-green)]" aria-hidden="true" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({
  id,
  icon,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="premium-card p-5 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-green-soft)] text-[var(--color-green)]">{icon}</div>
        <div>
          {eyebrow ? <p className="text-xs font-semibold uppercase text-[var(--color-green)]">{eyebrow}</p> : null}
          <h3 className="text-lg font-semibold text-[var(--color-navy)]">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function ProfileCard({
  profile,
  profileIndex,
  onProfileChange,
}: {
  profile: (typeof athleteProfiles)[number];
  profileIndex: number;
  onProfileChange: (index: number) => void;
}) {
  return (
    <Panel icon={<Target size={20} aria-hidden="true" />} title="Athlete profile" eyebrow="Demo profile">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2 rounded-md bg-[var(--color-page)] p-1" aria-label="Switch Demo Athlete profile">
          {athleteProfiles.map((candidate, index) => (
            <button
              key={candidate.sport}
              type="button"
              onClick={() => onProfileChange(index)}
              className={`rounded-md px-2 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)] ${
                profileIndex === index ? "bg-[var(--color-navy)] text-white shadow-sm" : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-navy)]"
              }`}
            >
              {candidate.sport}
            </button>
          ))}
        </div>

        <div>
          <p className="text-2xl font-semibold">{profile.name}</p>
          <p className="mt-1 text-[0.95rem] leading-6 text-[var(--color-muted-strong)]">{profile.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[0.95rem]">
          <div className="rounded-md bg-[var(--color-green-soft)] p-3">
            <p className="text-[var(--color-muted-strong)]">Target</p>
            <p className="mt-1 font-semibold">{profile.target}</p>
          </div>
          <div className="rounded-md bg-[var(--color-green-soft)] p-3">
            <p className="text-[var(--color-muted-strong)]">Location</p>
            <p className="mt-1 font-semibold">{profile.location}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Transferable strengths</p>
          <div className="flex flex-wrap gap-2">
            {profile.strengths.slice(0, 6).map((skill) => (
              <span key={skill} className="rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-medium text-white">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function CareerRecommender() {
  const [showAllPaths, setShowAllPaths] = useState(false);
  const visiblePaths = showAllPaths ? careerPaths : careerPaths.slice(0, 6);

  return (
    <Panel id="recommender" icon={<BriefcaseBusiness size={20} aria-hidden="true" />} title="Career path recommender" eyebrow="Role map">
      <div className="grid gap-5 md:grid-cols-2">
        {visiblePaths.map((path) => (
          <article key={path.category} className="interactive-card flex min-h-[250px] flex-col rounded-lg border border-[var(--color-border)] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--color-green)]">{path.category}</p>
                <h4 className="mt-2 text-lg font-semibold leading-6 text-[var(--color-navy)]">{path.role}</h4>
              </div>
              <span className="rounded-full bg-[var(--color-green-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-green)]">
                {path.match}%
              </span>
            </div>
            <p className="mt-4 text-[0.95rem] leading-7 text-[var(--color-muted-strong)]">{path.why}</p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              <span className="rounded-full bg-[var(--color-page)] px-3 py-1.5 text-xs font-semibold text-[var(--color-navy)]">{path.salary}</span>
              {path.remote ? (
                <span className="rounded-full bg-[#e6f3ee] px-3 py-1.5 text-xs font-semibold text-[var(--color-green)]">Remote Friendly</span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={() => setShowAllPaths((current) => !current)} className="btn-secondary">
          {showAllPaths ? "Show fewer paths" : "Show 2 more paths"}
          <ArrowRight className={showAllPaths ? "-rotate-90 transition" : "rotate-90 transition"} size={16} aria-hidden="true" />
        </button>
      </div>
    </Panel>
  );
}

function ResumeTranslator() {
  const [sportsExperience, setSportsExperience] = useState(translatorExamples[0]);
  const [generatedBullet, setGeneratedBullet] = useState(generateBusinessBullet(translatorExamples[0]));
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleGenerateBullet() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setGeneratedBullet(generateBusinessBullet(sportsExperience));
      setIsGenerating(false);
      setCopied(false);
    }, 420);
  }

  function handleClear() {
    setSportsExperience("");
    setGeneratedBullet("");
    setCopied(false);
  }

  function handleCopy() {
    copyToClipboard(generatedBullet, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <Panel id="translator" icon={<Wand2 size={20} aria-hidden="true" />} title="Resume bullet translator" eyebrow="Local generator">
      <div className="space-y-4">
        <p className="text-base leading-7 text-[var(--color-muted-strong)]">
          Paste a sports responsibility or accomplishment and translate it into professional business language.
        </p>

        <div className="flex flex-wrap gap-2">
          {translatorExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setSportsExperience(example);
                setGeneratedBullet(generateBusinessBullet(example));
              }}
              className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] transition hover:-translate-y-0.5 hover:border-[var(--color-green)] hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)]"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="grid gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-page)] p-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <label htmlFor="sports-experience" className="text-sm font-semibold text-[var(--color-navy)]">
              Sports experience
            </label>
            <textarea
              id="sports-experience"
              value={sportsExperience}
              onChange={(event) => setSportsExperience(event.target.value)}
              rows={6}
              className="mt-2 w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-3 text-[0.95rem] leading-7 text-[var(--color-navy)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/15"
              placeholder="Example: Led offseason training sessions for younger teammates"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleGenerateBullet}
                disabled={isGenerating}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                aria-busy={isGenerating}
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
                {isGenerating ? "Generating" : "Generate bullet"}
              </button>
              <button type="button" onClick={handleClear} className="btn-secondary">
                <Eraser size={16} aria-hidden="true" />
                Clear
              </button>
            </div>
          </div>

          <div className="flex min-h-[230px] flex-col rounded-md bg-[var(--color-navy)] p-4 text-white">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-slate-200">Generated business-ready bullet</p>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!generatedBullet}
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <Copy size={15} aria-hidden="true" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[0.95rem] leading-7 text-slate-100" aria-live="polite">
              {generatedBullet || "Your generated resume bullet will appear here."}
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {translatedBullets.map((bullet) => (
            <div key={bullet.from} className="interactive-card rounded-md border border-[var(--color-border)] bg-white p-4">
              <p className="text-xs font-semibold uppercase text-[var(--color-green)]">Example translation</p>
              <p className="mt-3 text-[0.95rem] leading-7 text-[var(--color-muted-strong)]">{bullet.from}</p>
              <p className="mt-3 rounded-md bg-[var(--color-green-soft)] p-3 text-[0.95rem] leading-7 text-[var(--color-navy)]">{bullet.to}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function JobFitScorer() {
  const [jobTitle, setJobTitle] = useState("AI Strategy Operations Analyst");
  const [skillsText, setSkillsText] = useState("Leadership, film review, finance coursework, team operations, data habits, stakeholder communication");
  const [analysis, setAnalysis] = useState(() => analyzeFit(jobTitle, skillsText));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleAnalyzeFit() {
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setAnalysis(analyzeFit(jobTitle, skillsText));
      setIsAnalyzing(false);
    }, 460);
  }

  return (
    <Panel icon={<BarChart3 size={20} aria-hidden="true" />} title="Job-fit scorer" eyebrow="Mock analysis">
      <div className="space-y-4">
        <div>
          <label htmlFor="job-title" className="text-sm font-semibold text-[var(--color-navy)]">
            Job title
          </label>
          <input
            id="job-title"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.95rem] outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/15"
          />
        </div>
        <div>
          <label htmlFor="job-skills" className="text-sm font-semibold text-[var(--color-navy)]">
            Athlete skills and role keywords
          </label>
          <textarea
            id="job-skills"
            value={skillsText}
            onChange={(event) => setSkillsText(event.target.value)}
            rows={5}
            className="mt-2 w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.95rem] leading-7 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/15"
          />
        </div>
        <button type="button" onClick={handleAnalyzeFit} disabled={isAnalyzing} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70" aria-busy={isAnalyzing}>
          {isAnalyzing ? <RefreshCw className="animate-spin" size={16} aria-hidden="true" /> : <Activity size={16} aria-hidden="true" />}
          {isAnalyzing ? "Analyzing" : "Analyze fit"}
        </button>

        <div className="rounded-md bg-[var(--color-navy)] p-4 text-white">
          <p className="text-sm text-slate-200">Fit score</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-semibold">{analysis.score}</span>
            <span className="pb-2 text-sm text-slate-200">/ 100</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/15">
            <div className="h-2 rounded-full bg-[var(--color-green-bright)] transition-all duration-500" style={{ width: `${analysis.score}%` }} />
          </div>
        </div>

        <ResultBlock title="Strengths" items={analysis.strengths} tone="green" />
        <ResultBlock title="Missing skills to build" items={analysis.missingSkills} tone="cream" />

        <div>
          <p className="mb-2 text-sm font-semibold">Recommended paths</p>
          <div className="flex flex-wrap gap-2">
            {analysis.recommendedPaths.map((path) => (
              <span key={path.category} className="rounded-full bg-[var(--color-page)] px-3 py-1 text-xs font-semibold text-[var(--color-navy)]">
                {path.category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ResultBlock({ title, items, tone }: { title: string; items: string[]; tone: "green" | "cream" }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              tone === "green" ? "bg-[var(--color-green-soft)] text-[var(--color-green)]" : "bg-[var(--color-page)] text-[var(--color-muted)]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function OutreachGenerator() {
  const [recipientRole, setRecipientRole] = useState("AI finance operator");
  const [tone, setTone] = useState("Warm");
  const [goal, setGoal] = useState("Advice call");
  const [variation, setVariation] = useState(0);
  const [copied, setCopied] = useState(false);

  const generatedMessage = useMemo(() => generateOutreachMessage(recipientRole, tone, goal, variation), [recipientRole, tone, goal, variation]);

  function handleCopy() {
    copyToClipboard(generatedMessage, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <Panel icon={<Mail size={20} aria-hidden="true" />} title="LinkedIn outreach generator" eyebrow="Networking">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4 rounded-md border border-[var(--color-border)] bg-[var(--color-page)] p-4">
          <div>
            <label htmlFor="recipient-role" className="text-sm font-semibold">
              Recipient role
            </label>
            <input
              id="recipient-role"
              value={recipientRole}
              onChange={(event) => {
                setRecipientRole(event.target.value);
                setCopied(false);
              }}
              className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.95rem] outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/15"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="text-sm font-semibold" htmlFor="tone">
              Tone
              <select
                id="tone"
                value={tone}
                onChange={(event) => {
                  setTone(event.target.value);
                  setCopied(false);
                }}
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.95rem] outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/15"
              >
                <option>Warm</option>
                <option>Direct</option>
                <option>Curious</option>
              </select>
            </label>
            <label className="text-sm font-semibold" htmlFor="goal">
              Goal
              <select
                id="goal"
                value={goal}
                onChange={(event) => {
                  setGoal(event.target.value);
                  setCopied(false);
                }}
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.95rem] outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/15"
              >
                <option>Advice call</option>
                <option>Referral conversation</option>
                <option>Skill guidance</option>
              </select>
            </label>
          </div>
          <button type="button" onClick={() => setVariation((current) => current + 1)} className="btn-secondary w-full">
            <RefreshCw size={16} aria-hidden="true" />
            Generate another
          </button>
        </div>

        <div className="flex min-h-[280px] flex-col rounded-md bg-[var(--color-navy)] p-4 text-white">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-semibold">Generated message</p>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Copy size={15} aria-hidden="true" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-[0.95rem] leading-7 text-slate-100" aria-live="polite">{generatedMessage}</p>
        </div>
      </div>
    </Panel>
  );
}

function AthleteSuccessSection() {
  return (
    <section id="features" className="border-y border-[var(--color-border)] bg-[var(--color-cream)] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[var(--color-green)]">Why athletes win after sports</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Why athletes succeed in business</h2>
          <p className="mt-3 text-base leading-7 text-[var(--color-muted-strong)]">
            AthleteOS turns traits employers already value into concrete language, role matches, and outreach that hiring teams can understand.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {athleteBusinessTraits.map((trait) => {
            const Icon = trait.icon;
            return (
              <article key={trait.title} className="interactive-card rounded-lg border border-[var(--color-border)] bg-white p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-[var(--color-green-soft)] text-[var(--color-green)]">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <h3 className="font-semibold">{trait.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-7 text-[var(--color-muted-strong)]">{trait.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-[var(--color-green)]">Founder</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built by Artsiom Barshchou</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--color-muted-strong)]">
            Professional hockey player, MBA in Finance, and AI evaluator building tools that help athletes transition into meaningful careers.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Athlete-first product", "Career transition focus", "AI-enabled workflow"].map((item) => (
              <span key={item} className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--color-green)] shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-card overflow-hidden p-0">
          <div className="bg-[linear-gradient(135deg,#111827,#1c2d3f_54%,#315c48)] p-6 text-white sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white shadow-xl shadow-slate-950/20">
                <Medal size={34} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-semibold">Artsiom Barshchou</p>
                <p className="mt-2 text-sm font-medium text-slate-200">Pro hockey player | MBA Finance | AI evaluator</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
            {[
              ["Pro", "Athlete lens"],
              ["MBA", "Finance training"],
              ["AI", "Evaluator workflow"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-[var(--color-border)] bg-[var(--color-page)] p-4">
                <p className="text-2xl font-semibold text-[var(--color-navy)]">{value}</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-muted-strong)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--color-navy)] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white text-[var(--color-navy)]">
              <Trophy size={20} aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold">AthleteOS</span>
          </div>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-slate-200">
            Copyright 2026 AthleteOS. Built by Artsiom Barshchou. Built for the OpenAI x Handshake Codex Creator Challenge.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="footer-link" href="https://github.com/aborshyov" target="_blank" rel="noreferrer" aria-label="Open Artsiom Barshchou GitHub profile in a new tab">
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a className="footer-link" href="https://www.linkedin.com/in/artsiom-barshchou-0402b8337" target="_blank" rel="noreferrer" aria-label="Open Artsiom Barshchou LinkedIn profile in a new tab">
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
          <a className="footer-link" href="mailto:borschev.artem@gmail.com" aria-label="Email Artsiom Barshchou">
            <Mail size={16} aria-hidden="true" />
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
