"use client";

import { useRef, useState, type ReactNode } from "react";
import { createPortal, flushSync } from "react-dom";
import {
  ArrowRight,
  Check,
  Download,
  FileCheck2,
  FilePenLine,
  ListChecks,
  Medal,
  Plus,
  Printer,
  Save,
  Target,
  UserRound,
} from "lucide-react";
import {
  approveContribution,
  buildContribution,
  canExport,
  createDraft,
  createExampleDraft,
  DRAFT_KEY,
  experienceTypes,
  exportProblems,
  includedExperiences,
  invalidateChecks,
  isReviewed,
  newContribution,
  newExperience,
  parseDraft,
  updateContribution,
  updateExperience,
  type Basics,
  type Contribution,
  type Experience,
  type ResumeDraft,
} from "./resume-model";

const steps = [
  "Your target",
  "Your experience",
  "Review bullets",
  "Build resume",
  "Final check",
];
const fieldClass = "resume-input";

function InputField({
  id,
  label,
  value,
  onChange,
  optional = false,
  type = "text",
  placeholder,
  autoComplete,
  maxLength = 200,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className="resume-field" htmlFor={id}>
      <span>
        {label}
        {optional ? <span className="resume-optional"> (optional)</span> : null}
      </span>
      <input
        id={id}
        className={fieldClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />
    </label>
  );
}
function AreaField({
  id,
  label,
  value,
  onChange,
  optional = false,
  placeholder,
  rows = 4,
  maxLength = 2000,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <label className="resume-field" htmlFor={id}>
      <span>
        {label}
        {optional ? <span className="resume-optional"> (optional)</span> : null}
      </span>
      <textarea
        id={id}
        className={fieldClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
      />
    </label>
  );
}
function CheckField({
  id,
  checked,
  onChange,
  children,
  disabled = false,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="resume-check" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

export function ResumeDocument({ draft }: { draft: ResumeDraft }) {
  const included = includedExperiences(draft);
  return (
    <article className="resume-paper" aria-label="Resume preview">
      {draft.example ? (
        <p className="resume-example-label">Fictional example resume</p>
      ) : null}
      <h2>{draft.basics.name.trim() || "Your name"}</h2>
      <p className="resume-contact">
        {[
          draft.basics.email,
          draft.basics.phone,
          draft.basics.location,
          draft.basics.links,
        ]
          .filter((value) => value.trim())
          .join(" | ") || "Your contact details"}
      </p>
      <section>
        <h3>Education</h3>
        <p>
          <strong>{draft.basics.school.trim() || "Your university"}</strong>
        </p>
        <p>{draft.basics.degree.trim() || "Your degree and major"}</p>
        <p>{draft.basics.graduation.trim() || "Your graduation date"}</p>
      </section>
      {experienceTypes.map((type) => {
        const experiences = included.filter(
          (experience) => experience.type === type,
        );
        if (!experiences.length) return null;
        return (
          <section key={type}>
            <h3>
              {type === "Athletics"
                ? "Athletic experience"
                : type === "Work or internship"
                  ? "Work experience"
                  : type === "Project"
                    ? "Projects"
                    : "Volunteering"}
            </h3>
            {experiences.map((experience) => (
              <div className="resume-document-experience" key={experience.id}>
                <div className="resume-document-heading">
                  <strong>
                    {experience.organization.trim() || "Organization"}
                  </strong>
                  <span>{experience.dates.trim() || "Dates"}</span>
                </div>
                <p>{experience.role.trim() || "Your role"}</p>
                <ul>
                  {experience.contributions.map((contribution) => (
                    <li key={contribution.id}>
                      {contribution.draft.trim() ||
                        "Create and review a bullet for this experience."}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
      {draft.basics.skills.trim() ? (
        <section>
          <h3>Skills</h3>
          <p>{draft.basics.skills}</p>
        </section>
      ) : null}
    </article>
  );
}

export default function ResumeWorkspace() {
  const [draft, setDraft] = useState<ResumeDraft>(createDraft);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [replacement, setReplacement] = useState<
    "example" | "new" | "load" | null
  >(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const revision = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const experience =
    draft.experiences.find((item) => item.id === draft.activeExperience) ||
    draft.experiences[0];
  const contribution =
    experience.contributions.find(
      (item) => item.id === draft.activeContribution,
    ) || experience.contributions[0];
  const reviewed = isReviewed(experience, contribution);
  const problems = exportProblems(draft);
  const ready = canExport(draft);
  const target = draft.target.role.trim() || "General first-career resume";

  function change(next: ResumeDraft) {
    revision.current++;
    setDraft(next);
    setDirty(true);
    setConfirmed(false);
    setError("");
    setMessage("");
    if (next.step !== draft.step)
      requestAnimationFrame(() => {
        heading.current?.focus({ preventScroll: true });
        heading.current?.scrollIntoView({ block: "nearest" });
      });
  }
  function navigate(step: number, question = draft.question) {
    setDraft((previous) => ({ ...previous, step, question }));
    setError("");
    setConfirmed(false);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "nearest" });
    });
  }
  function selectEntry(item: Experience, bullet: Contribution, step = 1) {
    setDraft((previous) => ({
      ...previous,
      activeExperience: item.id,
      activeContribution: bullet.id,
      step,
      question: 0,
    }));
    setConfirmed(false);
    setError("");
    requestAnimationFrame(() =>
      heading.current?.scrollIntoView({ block: "nearest" }),
    );
  }
  function editFact(key: "action" | "detail" | "result", value: string) {
    change(
      updateContribution(draft, experience.id, contribution.id, {
        [key]: value,
      }),
    );
  }
  function editExperience(patch: Parameters<typeof updateExperience>[2]) {
    change(updateExperience(draft, experience.id, patch));
  }
  function generate() {
    const result = buildContribution(contribution);
    if (!result.bullet) {
      setError(result.feedback);
      return;
    }
    change({
      ...updateContribution(draft, experience.id, contribution.id, {
        draft: result.bullet,
      }),
      step: 2,
    });
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  function advance(skip = false) {
    if (draft.question === 0 && !buildContribution(contribution).bullet) {
      setError(
        "Describe one responsibility or contribution before continuing.",
      );
      return;
    }
    let next = draft;
    if (skip && draft.question > 0)
      next = updateContribution(draft, experience.id, contribution.id, {
        [draft.question === 1 ? "detail" : "result"]: "",
      });
    if (draft.question < 2) {
      if (skip) change({ ...next, question: draft.question + 1 });
      else
        setDraft((previous) => ({
          ...previous,
          question: previous.question + 1,
        }));
      setError("");
    } else {
      const result = buildContribution(
        next.experiences
          .find((item) => item.id === experience.id)!
          .contributions.find((item) => item.id === contribution.id)!,
      );
      if (!result.bullet) {
        setError(result.feedback);
        return;
      }
      change({
        ...updateContribution(next, experience.id, contribution.id, {
          draft: result.bullet,
        }),
        step: 2,
      });
    }
  }
  function addExperience() {
    if (draft.experiences.length >= 20) {
      setError("This draft can hold up to 20 experiences.");
      return;
    }
    const item = newExperience(crypto.randomUUID(), crypto.randomUUID());
    change(
      invalidateChecks({
        ...draft,
        experiences: [...draft.experiences, item],
        activeExperience: item.id,
        activeContribution: item.contributions[0].id,
        step: 1,
        question: 0,
      }),
    );
  }
  function addBullet(item: Experience) {
    if (item.contributions.length >= 10) {
      setError("This experience can hold up to 10 bullets.");
      return;
    }
    const bullet = newContribution(crypto.randomUUID());
    change(
      invalidateChecks({
        ...draft,
        experiences: draft.experiences.map((entry) =>
          entry.id === item.id
            ? { ...entry, contributions: [...entry.contributions, bullet] }
            : entry,
        ),
        activeExperience: item.id,
        activeContribution: bullet.id,
        step: 1,
        question: 0,
      }),
    );
  }
  function removeExperience(id: string) {
    const remaining = draft.experiences.filter((item) => item.id !== id);
    if (!remaining.length)
      remaining.push(newExperience(crypto.randomUUID(), crypto.randomUUID()));
    change(
      invalidateChecks({
        ...draft,
        experiences: remaining,
        activeExperience: remaining[0].id,
        activeContribution: remaining[0].contributions[0].id,
      }),
    );
    setRemoveId(null);
  }
  function removeBullet(item: Experience, id: string) {
    const remaining = item.contributions.filter((bullet) => bullet.id !== id);
    if (!remaining.length) remaining.push(newContribution(crypto.randomUUID()));
    change(
      invalidateChecks({
        ...draft,
        experiences: draft.experiences.map((entry) =>
          entry.id === item.id ? { ...entry, contributions: remaining } : entry,
        ),
        activeExperience: item.id,
        activeContribution: remaining[0].id,
      }),
    );
  }
  function replace(kind: "example" | "new" | "load") {
    try {
      let next: ResumeDraft;
      if (kind === "load") {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) {
          setError("There is no saved draft on this device yet.");
          setReplacement(null);
          return;
        }
        next = parseDraft(raw);
      } else next = kind === "example" ? createExampleDraft() : createDraft();
      revision.current++;
      setDraft(next);
      setConfirmed(false);
      setDirty(kind === "example");
      setSaved(kind === "load");
      setPrintReady(false);
      setReplacement(null);
      setError("");
      setMessage(
        kind === "load"
          ? "Saved draft loaded. Repeat the final checks before exporting."
          : kind === "example"
            ? "Fictional example loaded. Start a new resume to enter your own details."
            : "New resume started. Your saved copy has not been changed.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The saved draft could not be loaded.",
      );
      setReplacement(null);
    }
  }
  function requestReplacement(kind: "example" | "new" | "load") {
    if (dirty) setReplacement(kind);
    else replace(kind);
  }
  function save() {
    try {
      const raw = JSON.stringify(draft);
      if (raw.length > 500_000)
        throw new Error(
          "This draft is too large to save. Shorten it before saving.",
        );
      localStorage.setItem(DRAFT_KEY, raw);
      setDirty(false);
      setSaved(true);
      setError("");
      setMessage(
        "Draft saved on this device. It stays here until you delete the saved copy.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message.startsWith("This draft")
          ? cause.message
          : "This browser could not save your draft. Keep this tab open and try downloading your completed resume.",
      );
    }
  }
  function deleteSaved() {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setSaved(false);
      setDirty(true);
      setError("");
      setMessage(
        "Saved copy deleted from this device. Your current draft is still open.",
      );
    } catch {
      setError(
        "This browser could not delete the saved copy. Your current draft is still open.",
      );
    }
  }
  async function downloadResume(format: "word" | "pdf") {
    if (!ready || exporting) return;
    const currentRevision = revision.current;
    const snapshot = draft;
    setExporting(true);
    setError("");
    setMessage(
      `Preparing your ${format === "word" ? "Word document" : "PDF"}...`,
    );
    try {
      const blob =
        format === "word"
          ? await (await import("./resume-docx")).createResumeDocx(snapshot)
          : await (await import("./resume-pdf")).createResumePdf(snapshot);
      if (currentRevision !== revision.current) {
        setMessage(
          "Your resume changed while the document was being prepared. Review it and download again.",
        );
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        snapshot.example
          ? "fictional-example"
          : snapshot.basics.name
              .trim()
              .replace(/[^\p{L}\p{N}]+/gu, "-")
              .replace(/^-|-$/g, "") || "athlete"
      }-resume.${format === "word" ? "docx" : "pdf"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(`${format === "word" ? "Word" : "PDF"} download started.`);
    } catch {
      setError(
        `The ${format === "word" ? "Word document" : "PDF"} could not be created. Your draft is still here. Try again or use the other format.`,
      );
    } finally {
      setExporting(false);
    }
  }
  function printResume() {
    if (!ready) return;
    flushSync(() => setPrintReady(true));
    window.print();
  }

  const icons = [Target, Medal, FilePenLine, UserRound, FileCheck2];
  const StepIcon = icons[draft.step];
  const title = [
    "What are you applying for?",
    "Start with one real experience",
    "Does this describe what you did?",
    "Bring your resume together",
    "Review your resume for this application",
  ][draft.step];

  return (
    <>
      <section
        id="translator"
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20"
        aria-label="Guided resume workspace"
      >
        <span id="demo" className="block scroll-mt-24" />
        <div className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-[var(--color-border)] pb-7">
          <div>
            <p className="resume-eyebrow">Your career workspace</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Build your first career resume
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--color-muted)]">
              Start with what you did. Review your wording, then put your
              experience into a resume.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => requestReplacement("example")}
            >
              Load fictional example
            </button>
            <button type="button" className="btn-primary" onClick={save}>
              <Save size={16} aria-hidden="true" />
              Save on this device
            </button>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-[var(--color-muted)]">
            {saved
              ? dirty
                ? "Changes since your last save."
                : "Saved copy loaded or up to date."
              : "Your draft is not saved yet."}{" "}
            Saving is optional and uses this browser only.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="resume-link"
              onClick={() => requestReplacement("load")}
            >
              Load saved draft
            </button>
            <button
              type="button"
              className="resume-link"
              onClick={() => requestReplacement("new")}
            >
              Start new
            </button>
          </div>
        </div>
        {replacement ? (
          <div className="resume-notice mb-6" role="alert">
            <p>
              You have unsaved changes.{" "}
              {replacement === "load"
                ? "Load the saved copy"
                : replacement === "example"
                  ? "Load the fictional example"
                  : "Start a new resume"}{" "}
              and replace this open draft?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary"
                onClick={() => replace(replacement)}
              >
                Replace open draft
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setReplacement(null)}
              >
                Keep working
              </button>
            </div>
          </div>
        ) : null}
        {draft.example ? (
          <div className="resume-notice mb-6">
            <strong>Fictional example.</strong> These details demonstrate the
            flow. Example downloads are labeled as fictional.{" "}
            <button
              type="button"
              className="resume-link"
              onClick={() => requestReplacement("new")}
            >
              Start my own resume
            </button>
          </div>
        ) : null}
        <p
          className="mb-4 text-sm text-[var(--color-muted)]"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
        {error ? (
          <p className="resume-error mb-5" role="alert">
            {error}
          </p>
        ) : null}
        <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-6">
            <section className="premium-card p-5 sm:p-6">
              <div className="resume-panel-heading">
                <span className="resume-icon">
                  <UserRound size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="resume-eyebrow">Your profile</p>
                  <h3 className="text-lg font-semibold">College athlete</h3>
                </div>
              </div>
              <p className="text-xl font-semibold break-words">
                {draft.basics.name.trim() || "Your name"}
              </p>
              <p className="mt-2 break-words text-[var(--color-muted)]">
                {draft.basics.school.trim() || "Add your education in step 4"}
              </p>
              {draft.basics.graduation.trim() ? (
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {draft.basics.graduation}
                </p>
              ) : null}
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <p className="text-sm text-[var(--color-muted)]">Your target</p>
                <p className="mt-1 font-semibold break-words">{target}</p>
              </div>
            </section>
            <section className="premium-card p-5 sm:p-6">
              <div className="resume-panel-heading">
                <span className="resume-icon">
                  <ListChecks size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="resume-eyebrow">Step {draft.step + 1} of 5</p>
                  <h3 className="text-lg font-semibold">Your resume steps</h3>
                </div>
              </div>
              <ol
                className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1"
                aria-label="Resume steps"
              >
                {steps.map((step, index) => (
                  <li key={step}>
                    <button
                      type="button"
                      className={`resume-step ${draft.step === index ? "resume-step-active" : ""}`}
                      aria-current={draft.step === index ? "step" : undefined}
                      onClick={() => navigate(index)}
                    >
                      <span className="resume-step-number">{index + 1}</span>
                      {step}
                    </button>
                  </li>
                ))}
              </ol>
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <p className="text-sm font-semibold">Your experiences</p>
                <ul className="mt-2 space-y-2">
                  {draft.experiences.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="resume-link w-full text-left break-words"
                        onClick={() => selectEntry(item, item.contributions[0])}
                      >
                        {item.organization.trim() || "New experience"}
                      </button>
                      <p className="text-xs text-[var(--color-muted)]">
                        {item.included
                          ? `${item.contributions.filter((bullet) => isReviewed(item, bullet)).length} of ${item.contributions.length} bullets reviewed`
                          : "Not included in this resume"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <details className="rounded-lg border border-[var(--color-border)] bg-white p-4 text-sm">
              <summary className="cursor-pointer font-semibold">
                About your saved draft
              </summary>
              <p className="mt-3 leading-6 text-[var(--color-muted)]">
                Your resume text is edited in this browser. It is not sent to an
                AI service. Saving keeps a copy on this device, including your
                contact details. Avoid saving on a shared device.
              </p>
              <button
                type="button"
                className="resume-link mt-3"
                onClick={deleteSaved}
              >
                Delete saved copy
              </button>
            </details>
          </aside>
          <div className="min-w-0">
            <section
              className="premium-card p-5 sm:p-6"
              aria-labelledby="resume-step-heading"
            >
              <div className="resume-panel-heading">
                <span className="resume-icon">
                  <StepIcon size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="resume-eyebrow">
                    Step {draft.step + 1} · {steps[draft.step]}
                  </p>
                  <h3
                    id="resume-step-heading"
                    className="text-lg font-semibold outline-offset-4"
                    ref={heading}
                    tabIndex={-1}
                  >
                    {title}
                  </h3>
                </div>
              </div>
              {draft.step === 0 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      id="target-role"
                      label="Role or internship"
                      value={draft.target.role}
                      placeholder="e.g. Operations Intern"
                      onChange={(role) =>
                        change(
                          invalidateChecks({
                            ...draft,
                            target: { ...draft.target, role },
                          }),
                        )
                      }
                    />
                    <InputField
                      id="target-employer"
                      label="Employer"
                      optional
                      value={draft.target.employer}
                      onChange={(employer) =>
                        change(
                          invalidateChecks({
                            ...draft,
                            target: { ...draft.target, employer },
                          }),
                        )
                      }
                    />
                  </div>
                  <AreaField
                    id="job-description"
                    label="Job description"
                    optional
                    value={draft.target.description}
                    placeholder="Paste the posting, or add it later."
                    maxLength={6000}
                    onChange={(description) =>
                      change(
                        invalidateChecks({
                          ...draft,
                          target: { ...draft.target, description },
                        }),
                      )
                    }
                  />
                  <p className="resume-help">
                    Use the posting to decide which examples belong on your
                    resume. You can also start with a general resume.
                  </p>
                  <div className="resume-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => navigate(1, 0)}
                    >
                      Continue to experience{" "}
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="resume-link"
                      onClick={() => {
                        setMessage(
                          "You can build a general resume first and choose a role later.",
                        );
                        navigate(1, 0);
                      }}
                    >
                      I&apos;m still exploring
                    </button>
                  </div>
                </div>
              ) : null}
              {draft.step === 1 ? (
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="resume-field" htmlFor="experience-type">
                      <span>Experience type</span>
                      <select
                        id="experience-type"
                        className={fieldClass}
                        value={experience.type}
                        onChange={(event) =>
                          editExperience({
                            type: event.target.value as Experience["type"],
                          })
                        }
                      >
                        {experienceTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                    <InputField
                      id="experience-role"
                      label="Your role"
                      value={experience.role}
                      placeholder="e.g. Student-athlete"
                      onChange={(role) => editExperience({ role })}
                    />
                    <InputField
                      id="experience-organization"
                      label="Team or organization"
                      value={experience.organization}
                      placeholder="e.g. University hockey team"
                      onChange={(organization) =>
                        editExperience({ organization })
                      }
                    />
                    <InputField
                      id="experience-dates"
                      label="Dates"
                      value={experience.dates}
                      placeholder="e.g. September 2023 to present"
                      onChange={(dates) => editExperience({ dates })}
                    />
                  </div>
                  <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                    <p className="resume-eyebrow">
                      Question {draft.question + 1} of 3
                      {draft.question > 0 ? " · Optional" : ""}
                    </p>
                    <h4 className="mt-2 text-xl font-semibold tracking-tight">
                      {
                        [
                          "What did you personally do?",
                          "What details make this specific?",
                          "Was there a result you can support?",
                        ][draft.question]
                      }
                    </h4>
                    <p className="mt-3 leading-7 text-[var(--color-muted)]">
                      {
                        [
                          "Describe one responsibility or contribution. Helping with something counts.",
                          "How did you do it? Who was involved? Add numbers or tools only if you know them.",
                          "Leave this blank if the outcome was not measured or you do not know.",
                        ][draft.question]
                      }
                    </p>
                    <div className="mt-4">
                      {draft.question === 0 ? (
                        <AreaField
                          id="contribution-action"
                          label="Your contribution"
                          value={contribution.action}
                          onChange={(value) => editFact("action", value)}
                          placeholder="e.g. I helped plan 2 practices for 8 teammates."
                        />
                      ) : draft.question === 1 ? (
                        <AreaField
                          id="contribution-detail"
                          label="Supporting details"
                          optional
                          value={contribution.detail}
                          onChange={(value) => editFact("detail", value)}
                          placeholder="e.g. I sent schedules and checked attendance."
                        />
                      ) : (
                        <AreaField
                          id="contribution-result"
                          label="Supported result"
                          optional
                          value={contribution.result}
                          onChange={(value) => editFact("result", value)}
                          placeholder="Only include a result that happened and you can explain."
                        />
                      )}
                    </div>
                    <p className="resume-help mt-3">
                      {draft.question === 0
                        ? "Think about practice, travel, mentoring, equipment, events, or team responsibilities."
                        : draft.question === 1
                          ? "Keep the team's outcome separate from your own contribution."
                          : "A clear responsibility can be useful without a measured result."}
                    </p>
                  </div>
                  <div className="resume-actions justify-between">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        draft.question === 0
                          ? navigate(0)
                          : navigate(1, draft.question - 1)
                      }
                    >
                      {draft.question === 0
                        ? "Back to target"
                        : "Previous question"}
                    </button>
                    <div className="flex flex-wrap gap-3">
                      {draft.question > 0 ? (
                        <button
                          type="button"
                          className="resume-link"
                          onClick={() => advance(true)}
                        >
                          Skip this question
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => advance()}
                      >
                        {draft.question === 2
                          ? "Create bullet draft"
                          : "Continue"}
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              {draft.step === 2 ? (
                <div>
                  <div className="rounded-lg bg-[var(--color-page)] p-4">
                    <p className="resume-eyebrow">Your facts</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--color-muted-strong)]">
                      {[
                        contribution.action,
                        contribution.detail,
                        contribution.result,
                      ]
                        .filter((value) => value.trim())
                        .map((value, index) => (
                          <li
                            className="whitespace-pre-wrap break-words"
                            key={index}
                          >
                            {value}
                          </li>
                        ))}
                    </ul>
                    {!contribution.action.trim() ? (
                      <p className="mt-3 resume-help">
                        Add your own contribution in step 2.
                      </p>
                    ) : null}
                  </div>
                  <details className="mt-5 border-t border-[var(--color-border)] pt-4">
                    <summary className="cursor-pointer font-semibold text-[var(--color-green)]">
                      Compare with your target role
                    </summary>
                    <p className="mt-3 font-semibold break-words">{target}</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--color-muted)]">
                      {draft.target.description.trim() ||
                        "Add a posting when you have a specific application in mind."}
                    </p>
                    <p className="resume-help mt-3">
                      Choose details that show what this employer asks for. Do
                      not claim skills you have not demonstrated.
                    </p>
                  </details>
                  <div className="resume-bullet-editor mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                      Editable bullet draft
                    </p>
                    <div className="mt-3">
                      <AreaField
                        id="bullet-draft"
                        label="Your resume wording"
                        value={contribution.draft}
                        onChange={(value) =>
                          change(
                            updateContribution(
                              draft,
                              experience.id,
                              contribution.id,
                              { draft: value },
                            ),
                          )
                        }
                        maxLength={6000}
                        placeholder="Create a draft from your facts, then review it here."
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      This is local wording cleanup. Check every claim against
                      your facts.
                    </p>
                  </div>
                  {!contribution.draft.trim() ? (
                    <button
                      type="button"
                      className="btn-secondary mt-4"
                      onClick={generate}
                    >
                      Create draft from facts
                    </button>
                  ) : null}
                  <p className="mt-4 text-sm font-semibold text-[var(--color-green)]">
                    {reviewed
                      ? "Reviewed and added to your resume"
                      : "Needs your review"}
                  </p>
                  <CheckField
                    id="confirm-bullet"
                    checked={confirmed || reviewed}
                    onChange={(value) => {
                      setConfirmed(value);
                      if (!value && reviewed)
                        change(
                          updateContribution(
                            draft,
                            experience.id,
                            contribution.id,
                            { draft: contribution.draft },
                          ),
                        );
                    }}
                  >
                    I can explain and support every claim in this bullet.
                  </CheckField>
                  <div className="resume-actions justify-between">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigate(1, 0)}
                    >
                      Edit facts
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={
                        !(confirmed || reviewed) ||
                        !contribution.draft.trim() ||
                        !buildContribution(contribution).bullet
                      }
                      onClick={() => {
                        change({
                          ...approveContribution(
                            draft,
                            experience.id,
                            contribution.id,
                          ),
                          step: 3,
                        });
                      }}
                    >
                      Use this bullet <Check size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}
              {draft.step === 3 ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(
                      [
                        { key: "name", label: "Name", autoComplete: "name" },
                        {
                          key: "email",
                          label: "Email",
                          type: "email",
                          autoComplete: "email",
                        },
                        {
                          key: "phone",
                          label: "Phone",
                          optional: true,
                          type: "tel",
                          autoComplete: "tel",
                        },
                        {
                          key: "location",
                          label: "City and state",
                          optional: true,
                        },
                        {
                          key: "links",
                          label: "LinkedIn or portfolio",
                          optional: true,
                        },
                        { key: "school", label: "University" },
                        { key: "degree", label: "Degree and major" },
                        { key: "graduation", label: "Graduation date" },
                      ] as {
                        key: keyof Basics;
                        label: string;
                        optional?: boolean;
                        type?: string;
                        autoComplete?: string;
                      }[]
                    ).map((field) => (
                      <InputField
                        key={field.key}
                        id={`basics-${field.key}`}
                        label={field.label}
                        optional={field.optional}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        value={draft.basics[field.key]}
                        onChange={(value) =>
                          change(
                            invalidateChecks({
                              ...draft,
                              basics: { ...draft.basics, [field.key]: value },
                            }),
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-5">
                    <h4 className="font-semibold">Your experience entries</h4>
                    <p className="resume-help mt-2">
                      Include athletics, work, projects, and volunteering that
                      matter for this application. Excluded entries stay in your
                      draft.
                    </p>
                    <div className="mt-4 space-y-4">
                      {draft.experiences.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-[var(--color-border)] p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold break-words">
                                {item.organization.trim() || "New experience"}
                              </p>
                              <p className="resume-help">
                                {item.role.trim() || "Add your role"} ·{" "}
                                {item.type}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="resume-link"
                              onClick={() =>
                                selectEntry(item, item.contributions[0])
                              }
                            >
                              Edit details
                            </button>
                          </div>
                          <CheckField
                            id={`include-${item.id}`}
                            checked={item.included}
                            onChange={(included) =>
                              change(
                                updateExperience(draft, item.id, { included }),
                              )
                            }
                          >
                            Include in this resume
                          </CheckField>
                          <ul className="mt-2 space-y-3">
                            {item.contributions.map((bullet, index) => (
                              <li key={bullet.id}>
                                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                  {bullet.draft.trim() ||
                                    `Bullet ${index + 1}: add and review your contribution.`}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                                  <span
                                    className={
                                      isReviewed(item, bullet)
                                        ? "text-[var(--color-green)]"
                                        : "text-amber-800"
                                    }
                                  >
                                    {isReviewed(item, bullet)
                                      ? "Reviewed"
                                      : "Needs review"}
                                  </span>
                                  <button
                                    type="button"
                                    className="resume-link"
                                    onClick={() => selectEntry(item, bullet, 2)}
                                  >
                                    Review bullet {index + 1}
                                  </button>
                                  {item.contributions.length > 1 ? (
                                    <button
                                      type="button"
                                      className="resume-link"
                                      onClick={() =>
                                        removeBullet(item, bullet.id)
                                      }
                                    >
                                      Remove bullet {index + 1}
                                    </button>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex flex-wrap gap-4">
                            <button
                              type="button"
                              className="resume-link"
                              onClick={() => addBullet(item)}
                              disabled={item.contributions.length >= 10}
                            >
                              Add another bullet
                            </button>
                            <button
                              type="button"
                              className="resume-link"
                              onClick={() => setRemoveId(item.id)}
                            >
                              Remove experience
                            </button>
                          </div>
                          {removeId === item.id ? (
                            <div className="resume-notice mt-3" role="alert">
                              <p>
                                Remove this experience and its bullets from the
                                open draft?
                              </p>
                              <div className="mt-2 flex gap-3">
                                <button
                                  type="button"
                                  className="resume-link"
                                  onClick={() => removeExperience(item.id)}
                                >
                                  Yes, remove it
                                </button>
                                <button
                                  type="button"
                                  className="resume-link"
                                  onClick={() => setRemoveId(null)}
                                >
                                  Keep it
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn-secondary mt-4"
                      onClick={addExperience}
                      disabled={draft.experiences.length >= 20}
                    >
                      <Plus size={16} aria-hidden="true" />
                      Add another experience
                    </button>
                  </div>
                  <AreaField
                    id="basics-skills"
                    label="Skills you can demonstrate"
                    optional
                    value={draft.basics.skills}
                    onChange={(skills) =>
                      change(
                        invalidateChecks({
                          ...draft,
                          basics: { ...draft.basics, skills },
                        }),
                      )
                    }
                    placeholder="Only include skills supported by your experience or training."
                    rows={2}
                  />
                  <div className="resume-actions justify-between">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigate(2)}
                    >
                      Back to bullets
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => navigate(4)}
                    >
                      Preview resume <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}
              {draft.step === 4 ? (
                <div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Target: {target}
                    {draft.target.employer.trim()
                      ? ` at ${draft.target.employer}`
                      : ""}
                  </p>
                  {problems.length ? (
                    <div className="resume-notice mt-4">
                      <p className="font-semibold">Before exporting</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {problems.map((problem) => (
                          <li key={problem}>{problem}</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="resume-link"
                          onClick={() => navigate(3)}
                        >
                          Edit resume details
                        </button>
                        <button
                          type="button"
                          className="resume-link"
                          onClick={() => {
                            const item = includedExperiences(draft).find(
                              (entry) =>
                                entry.contributions.some(
                                  (bullet) => !isReviewed(entry, bullet),
                                ),
                            );
                            if (item)
                              selectEntry(
                                item,
                                item.contributions.find(
                                  (bullet) => !isReviewed(item, bullet),
                                )!,
                                2,
                              );
                            else navigate(3);
                          }}
                        >
                          Review experience
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-5">
                    <ResumeDocument draft={draft} />
                  </div>
                  <CheckField
                    id="final-accuracy"
                    checked={draft.checks.accuracy}
                    onChange={(accuracy) =>
                      setDraft((previous) => ({
                        ...previous,
                        checks: { ...previous.checks, accuracy },
                      }))
                    }
                    disabled={problems.length > 0}
                  >
                    I checked my facts, dates, contact details, and every claim.
                  </CheckField>
                  <CheckField
                    id="final-relevance"
                    checked={draft.checks.relevance}
                    onChange={(relevance) =>
                      setDraft((previous) => ({
                        ...previous,
                        checks: { ...previous.checks, relevance },
                      }))
                    }
                    disabled={problems.length > 0}
                  >
                    I selected experience that is relevant to this application.
                  </CheckField>
                  <div className="resume-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={!ready || exporting}
                      onClick={() => downloadResume("word")}
                    >
                      <Download size={16} aria-hidden="true" />
                      {exporting ? "Preparing document" : "Download Word"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={!ready || exporting}
                      onClick={() => downloadResume("pdf")}
                    >
                      <Download size={16} aria-hidden="true" />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      className="resume-link"
                      disabled={!ready || exporting}
                      onClick={printResume}
                    >
                      <Printer size={16} aria-hidden="true" />
                      Print resume
                    </button>
                    <button
                      type="button"
                      className="resume-link"
                      onClick={() => navigate(3)}
                    >
                      Edit resume
                    </button>
                  </div>
                  <p className="resume-help mt-4">
                    Word and PDF downloads use the reviewed content above. Check
                    the exported document and page breaks before sending. If you
                    print, turn off browser headers and footers.
                  </p>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </section>
      {printReady && ready
        ? createPortal(
            <div className="resume-print">
              <ResumeDocument draft={draft} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
