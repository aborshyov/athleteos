import {
  ArrowRight,
  Check,
  FileCheck2,
  Github,
  Linkedin,
  Mail,
  Medal,
  NotebookPen,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import ResumeWorkspace from "./resume-workspace";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-page)] text-[var(--color-navy)]">
      <Header />
      <Hero />
      <ResumeWorkspace />
      <Features />
      <AboutSection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[rgba(247,246,239,0.82)] backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8"
        aria-label="Primary navigation"
      >
        <a
          href="#home"
          className="group flex items-center gap-3 rounded-md outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)]"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-[var(--color-navy)] text-white shadow-lg shadow-slate-900/15">
            <Trophy size={20} aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            AthleteOS
          </span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {[
            ["Home", "#home"],
            ["Features", "#features"],
            ["Resume", "#translator"],
            ["About", "#about"],
          ].map(([label, href]) => (
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
          Get Started <ArrowRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-cream)]"
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className="accent-line accent-line-one" aria-hidden="true" />
      <div className="accent-line accent-line-two" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/85 px-3 py-1.5 text-sm font-semibold text-[var(--color-green)] shadow-sm">
            <NotebookPen size={15} aria-hidden="true" />
            For college athletes
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            AthleteOS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl sm:leading-9">
            Turn your experience into a resume for your first internship or job.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            Describe what you did, review the wording, and build a resume using
            facts you can support.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a className="btn-primary" href="#translator">
              Build your resume <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="btn-secondary" href="#features">
              See how it works
            </a>
          </div>
          <div
            className="mt-9 flex flex-wrap gap-2.5"
            aria-label="Resume workflow features"
          >
            {["Guided questions", "Your facts", "Editable resume"].map(
              (label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] shadow-sm"
                >
                  <Check
                    size={14}
                    className="text-[var(--color-green)]"
                    aria-hidden="true"
                  />
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="relative z-10 rounded-xl border border-white bg-white/85 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="rounded-lg bg-[linear-gradient(135deg,#111827,#203044)] p-6 text-white">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm text-slate-200">
                  A clear path from experience to resume
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Start with what you did
                </h2>
                <p className="mt-3 leading-7 text-slate-200">
                  You do not need a captain title or a measured result to
                  describe a useful contribution.
                </p>
              </div>
              <Medal
                size={34}
                className="shrink-0 text-[#d6c47c]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid gap-3 p-5">
            {[
              "Collect your experience",
              "Review each bullet against your facts",
              "Build, download, or print your resume",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-3 text-sm font-medium"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-green-soft)] text-[var(--color-green)]">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Gather your experience",
      icon: NotebookPen,
      text: "Work through short questions about your role, actions, and supporting details. Results are optional.",
    },
    {
      title: "Review every claim",
      icon: ShieldCheck,
      text: "Compare editable bullets with the facts you entered. Keep your own contribution separate from team outcomes.",
    },
    {
      title: "Build and export",
      icon: FileCheck2,
      text: "Bring together education, athletics, work, projects, and volunteering. Download Word or PDF after your final review.",
    },
  ];
  return (
    <section
      id="features"
      className="border-y border-[var(--color-border)] bg-[var(--color-cream)] px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-[var(--color-green)]">
          From sport to your next step
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          A resume built around your experience
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="interactive-card rounded-lg border border-[var(--color-border)] bg-white p-5"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-md bg-[var(--color-green-soft)] text-[var(--color-green)]">
                <feature.icon size={21} aria-hidden="true" />
              </span>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 leading-7 text-[var(--color-muted-strong)]">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-[var(--color-green)]">
            Founder
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built by Artsiom Barshchou
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--color-muted-strong)]">
            Professional hockey player, MBA in Finance, and AI evaluator
            building tools that help athletes transition into meaningful
            careers.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Athlete-first product",
              "Career transition focus",
              "Guided resume flow",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--color-green)] shadow-sm"
              >
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
                <p className="mt-2 text-sm font-medium text-slate-200">
                  Pro hockey player | MBA Finance | AI evaluator
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
            {[
              ["Pro", "Athlete lens"],
              ["MBA", "Finance training"],
              ["AI", "Evaluator workflow"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-page)] p-4"
              >
                <p className="text-2xl font-semibold text-[var(--color-navy)]">
                  {value}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-muted-strong)]">
                  {label}
                </p>
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
            Copyright 2026 AthleteOS. Built by Artsiom Barshchou. Built for the
            OpenAI x Handshake Codex Creator Challenge.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            className="footer-link"
            href="https://github.com/aborshyov"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Artsiom Barshchou GitHub profile in a new tab"
          >
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a
            className="footer-link"
            href="https://www.linkedin.com/in/artsiom-barshchou-0402b8337"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Artsiom Barshchou LinkedIn profile in a new tab"
          >
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
          <a
            className="footer-link"
            href="mailto:borschev.artem@gmail.com"
            aria-label="Email Artsiom Barshchou"
          >
            <Mail size={16} aria-hidden="true" />
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
