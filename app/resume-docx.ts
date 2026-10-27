import { Document, Packer, Paragraph, TextRun } from "docx";
import {
  canExport,
  experienceTypes,
  includedExperiences,
  type ResumeDraft,
} from "./resume-model.ts";

export async function createResumeDocx(draft: ResumeDraft): Promise<Blob> {
  if (!canExport(draft))
    throw new Error("Finish the resume review before downloading.");
  const paragraphs: Paragraph[] = [];
  const add = (text: string, bold = false, size = 22) =>
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: text.trim(), bold, size })],
        spacing: { after: 80 },
      }),
    );
  const heading = (text: string) =>
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 22 })],
        spacing: { before: 220, after: 90 },
        keepNext: true,
      }),
    );
  if (draft.example) add("FICTIONAL EXAMPLE RESUME", true, 18);
  add(draft.basics.name, true, 32);
  add(
    [
      draft.basics.email,
      draft.basics.phone,
      draft.basics.location,
      draft.basics.links,
    ]
      .filter((value) => value.trim())
      .join(" | "),
  );
  heading("EDUCATION");
  add(draft.basics.school, true);
  add(draft.basics.degree);
  add(draft.basics.graduation);
  for (const type of experienceTypes) {
    const experiences = includedExperiences(draft).filter(
      (experience) => experience.type === type,
    );
    if (!experiences.length) continue;
    heading(
      type === "Athletics"
        ? "ATHLETIC EXPERIENCE"
        : type === "Work or internship"
          ? "WORK EXPERIENCE"
          : type === "Project"
            ? "PROJECTS"
            : "VOLUNTEERING",
    );
    for (const experience of experiences) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: experience.organization.trim(), bold: true }),
            new TextRun({ text: ` | ${experience.dates.trim()}` }),
          ],
          keepNext: true,
          spacing: { before: 100, after: 60 },
        }),
      );
      paragraphs.push(
        new Paragraph({
          text: experience.role.trim(),
          keepNext: true,
          spacing: { after: 60 },
        }),
      );
      for (const contribution of experience.contributions)
        paragraphs.push(
          new Paragraph({
            text: contribution.draft.trim(),
            bullet: { level: 0 },
            spacing: { after: 90 },
          }),
        );
    }
  }
  if (draft.basics.skills.trim()) {
    heading("SKILLS");
    add(draft.basics.skills);
  }
  const document = new Document({
    creator: "AthleteOS",
    title: draft.example
      ? "Fictional example resume"
      : `${draft.basics.name.trim()} resume`,
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22 },
          paragraph: { spacing: { line: 260 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: paragraphs,
      },
    ],
  });
  return Packer.toBlob(document);
}
