import { generateBusinessBullet } from "./resume-bullet.ts";

export const DRAFT_KEY = "athleteos:resume:v1";
export const experienceTypes = [
  "Athletics",
  "Work or internship",
  "Project",
  "Volunteering",
] as const;
export type ExperienceType = (typeof experienceTypes)[number];
export type Contribution = {
  id: string;
  action: string;
  detail: string;
  result: string;
  draft: string;
  reviewedFingerprint: string | null;
};
export type Experience = {
  id: string;
  type: ExperienceType;
  organization: string;
  role: string;
  dates: string;
  included: boolean;
  contributions: Contribution[];
};
export type Basics = {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  school: string;
  degree: string;
  graduation: string;
  skills: string;
};
export type ResumeDraft = {
  version: 1;
  example: boolean;
  target: { role: string; employer: string; description: string };
  basics: Basics;
  experiences: Experience[];
  activeExperience: string;
  activeContribution: string;
  step: number;
  question: number;
  checks: { accuracy: boolean; relevance: boolean };
};

export function newContribution(id: string): Contribution {
  return {
    id,
    action: "",
    detail: "",
    result: "",
    draft: "",
    reviewedFingerprint: null,
  };
}
export function newExperience(id: string, contributionId: string): Experience {
  return {
    id,
    type: "Athletics",
    organization: "",
    role: "",
    dates: "",
    included: true,
    contributions: [newContribution(contributionId)],
  };
}
export function createDraft(): ResumeDraft {
  return {
    version: 1,
    example: false,
    target: { role: "", employer: "", description: "" },
    basics: {
      name: "",
      email: "",
      phone: "",
      location: "",
      links: "",
      school: "",
      degree: "",
      graduation: "",
      skills: "",
    },
    experiences: [newExperience("experience-1", "contribution-1")],
    activeExperience: "experience-1",
    activeContribution: "contribution-1",
    step: 0,
    question: 0,
    checks: { accuracy: false, relevance: false },
  };
}
export function createExampleDraft(): ResumeDraft {
  const draft = createDraft();
  draft.example = true;
  draft.target = {
    role: "Operations Intern",
    employer: "Example employer",
    description:
      "Help coordinate schedules, keep records accurate, and communicate updates to the team. Familiarity with Excel is useful.",
  };
  draft.basics = {
    name: "Example Athlete",
    email: "athlete@example.com",
    phone: "",
    location: "",
    links: "",
    school: "Example University",
    degree: "B.S. in Business Administration",
    graduation: "Expected May 2027",
    skills: "Excel, scheduling, attendance tracking",
  };
  draft.experiences[0] = {
    ...draft.experiences[0],
    organization: "Example University Hockey",
    role: "Student-athlete",
    dates: "September 2023 to present",
    contributions: [
      {
        ...newContribution("contribution-1"),
        action: "I helped plan 2 preseason practices for 8 teammates.",
        detail: "I sent schedules and checked attendance.",
      },
    ],
  };
  return draft;
}

export function invalidateChecks(draft: ResumeDraft): ResumeDraft {
  return { ...draft, checks: { accuracy: false, relevance: false } };
}
export function fingerprint(
  experience: Experience,
  contribution: Contribution,
): string {
  return JSON.stringify([
    experience.type,
    experience.organization,
    experience.role,
    experience.dates,
    contribution.action,
    contribution.detail,
    contribution.result,
    contribution.draft,
  ]);
}
export function isReviewed(
  experience: Experience,
  contribution: Contribution,
): boolean {
  return Boolean(
    generateBusinessBullet(contribution.action).bullet &&
    contribution.draft.trim() &&
    contribution.reviewedFingerprint === fingerprint(experience, contribution),
  );
}
export function updateExperience(
  draft: ResumeDraft,
  id: string,
  patch: Partial<
    Pick<Experience, "type" | "organization" | "role" | "dates" | "included">
  >,
): ResumeDraft {
  return invalidateChecks({
    ...draft,
    experiences: draft.experiences.map((experience) =>
      experience.id !== id ? experience : { ...experience, ...patch },
    ),
  });
}
export function updateContribution(
  draft: ResumeDraft,
  experienceId: string,
  contributionId: string,
  patch: Partial<Pick<Contribution, "action" | "detail" | "result" | "draft">>,
): ResumeDraft {
  const factsChanged =
    "action" in patch || "detail" in patch || "result" in patch;
  return invalidateChecks({
    ...draft,
    experiences: draft.experiences.map((experience) =>
      experience.id !== experienceId
        ? experience
        : {
            ...experience,
            contributions: experience.contributions.map((contribution) =>
              contribution.id !== contributionId
                ? contribution
                : {
                    ...contribution,
                    ...patch,
                    ...(factsChanged ? { draft: "" } : {}),
                    reviewedFingerprint: null,
                  },
            ),
          },
    ),
  });
}
export function buildContribution(contribution: Contribution): {
  bullet: string;
  feedback: string;
} {
  const action = generateBusinessBullet(contribution.action);
  if (!action.bullet) return action;
  const details = [contribution.detail, contribution.result]
    .filter((value) => value.trim())
    .map((value) => generateBusinessBullet(value).bullet || value.trim());
  return { bullet: [action.bullet, ...details].join(" "), feedback: "" };
}
export function approveContribution(
  draft: ResumeDraft,
  experienceId: string,
  contributionId: string,
): ResumeDraft {
  return invalidateChecks({
    ...draft,
    experiences: draft.experiences.map((experience) =>
      experience.id !== experienceId
        ? experience
        : {
            ...experience,
            contributions: experience.contributions.map((contribution) =>
              contribution.id !== contributionId ||
              !buildContribution(contribution).bullet ||
              !contribution.draft.trim()
                ? contribution
                : {
                    ...contribution,
                    reviewedFingerprint: fingerprint(experience, contribution),
                  },
            ),
          },
    ),
  });
}
export function includedExperiences(draft: ResumeDraft): Experience[] {
  return draft.experiences.filter((experience) => experience.included);
}
export function exportProblems(draft: ResumeDraft): string[] {
  const problems: string[] = [];
  const { basics } = draft;
  if (!basics.name.trim()) problems.push("Add your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email.trim()))
    problems.push("Add a valid email address.");
  if (
    !basics.school.trim() ||
    !basics.degree.trim() ||
    !basics.graduation.trim()
  )
    problems.push("Add your university, degree, and graduation date.");
  const included = includedExperiences(draft);
  if (!included.length) problems.push("Include at least one experience.");
  for (const experience of included) {
    const name = experience.organization.trim() || "An included experience";
    if (
      !experience.organization.trim() ||
      !experience.role.trim() ||
      !experience.dates.trim()
    )
      problems.push(`${name}: add the organization, role, and dates.`);
    if (
      !experience.contributions.length ||
      experience.contributions.some(
        (contribution) => !isReviewed(experience, contribution),
      )
    )
      problems.push(`${name}: review each bullet against your facts.`);
  }
  return problems;
}
export function canExport(draft: ResumeDraft): boolean {
  return (
    exportProblems(draft).length === 0 &&
    draft.checks.accuracy &&
    draft.checks.relevance
  );
}

// Saved browser data is untrusted. Reject unsupported or damaged drafts rather
// than silently dropping facts, and always repeat the final review after loading.
export function parseDraft(raw: string): ResumeDraft {
  if (raw.length > 500_000)
    throw new Error("The saved draft is too large to load.");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error(
      "The saved draft could not be read. Your open draft was not changed.",
    );
  }
  const record = (item: unknown): item is Record<string, unknown> =>
    Boolean(item && typeof item === "object" && !Array.isArray(item));
  const string = (item: unknown, max = 6000): item is string =>
    typeof item === "string" && item.length <= max;
  if (
    !record(value) ||
    value.version !== 1 ||
    typeof value.example !== "boolean" ||
    !record(value.target) ||
    !record(value.basics) ||
    !Array.isArray(value.experiences) ||
    value.experiences.length < 1 ||
    value.experiences.length > 20
  )
    throw new Error("This saved draft has an unsupported format.");
  if (
    !["role", "employer", "description"].every((key) =>
      string(value.target && (value.target as Record<string, unknown>)[key]),
    )
  )
    throw new Error("The saved target details could not be read.");
  if (
    ![
      "name",
      "email",
      "phone",
      "location",
      "links",
      "school",
      "degree",
      "graduation",
      "skills",
    ].every((key) => string((value.basics as Record<string, unknown>)[key]))
  )
    throw new Error("The saved profile could not be read.");
  const ids = new Set<string>();
  for (const experience of value.experiences) {
    if (
      !record(experience) ||
      !string(experience.id, 100) ||
      ids.has(experience.id) ||
      !experienceTypes.includes(experience.type as ExperienceType) ||
      !["organization", "role", "dates"].every((key) =>
        string(experience[key]),
      ) ||
      typeof experience.included !== "boolean" ||
      !Array.isArray(experience.contributions) ||
      !experience.contributions.length ||
      experience.contributions.length > 10
    )
      throw new Error("A saved experience could not be read.");
    ids.add(experience.id);
    for (const contribution of experience.contributions) {
      if (
        !record(contribution) ||
        !string(contribution.id, 100) ||
        ids.has(contribution.id) ||
        !["action", "detail", "result", "draft"].every((key) =>
          string(contribution[key]),
        ) ||
        !(
          contribution.reviewedFingerprint === null ||
          string(contribution.reviewedFingerprint, 30000)
        )
      )
        throw new Error("A saved bullet could not be read.");
      ids.add(contribution.id);
    }
  }
  const draft = value as unknown as ResumeDraft;
  const experience =
    draft.experiences.find((item) => item.id === draft.activeExperience) ||
    draft.experiences[0];
  const contribution =
    experience.contributions.find(
      (item) => item.id === draft.activeContribution,
    ) || experience.contributions[0];
  return {
    version: 1,
    example: draft.example,
    target: {
      role: draft.target.role,
      employer: draft.target.employer,
      description: draft.target.description,
    },
    basics: {
      name: draft.basics.name,
      email: draft.basics.email,
      phone: draft.basics.phone,
      location: draft.basics.location,
      links: draft.basics.links,
      school: draft.basics.school,
      degree: draft.basics.degree,
      graduation: draft.basics.graduation,
      skills: draft.basics.skills,
    },
    experiences: draft.experiences.map((item) => ({
      id: item.id,
      type: item.type,
      organization: item.organization,
      role: item.role,
      dates: item.dates,
      included: item.included,
      contributions: item.contributions.map((bullet) => ({
        id: bullet.id,
        action: bullet.action,
        detail: bullet.detail,
        result: bullet.result,
        draft: bullet.draft,
        reviewedFingerprint: bullet.reviewedFingerprint,
      })),
    })),
    activeExperience: experience.id,
    activeContribution: contribution.id,
    step:
      Number.isInteger(draft.step) && draft.step >= 0 && draft.step <= 4
        ? draft.step
        : 0,
    question:
      Number.isInteger(draft.question) &&
      draft.question >= 0 &&
      draft.question <= 2
        ? draft.question
        : 0,
    checks: { accuracy: false, relevance: false },
  };
}
