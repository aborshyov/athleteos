import pdfMake from "pdfmake/build/pdfmake.js";
import fonts from "pdfmake/build/vfs_fonts.js";
import {
  canExport,
  experienceTypes,
  includedExperiences,
  type ResumeDraft,
} from "./resume-model.ts";

type PdfNode = {
  text?: string;
  bold?: boolean;
  fontSize?: number;
  margin?: number[];
  ul?: { text: string; margin: number[] }[];
  unbreakable?: boolean;
  stack?: PdfNode[];
  headlineLevel?: number;
};

export async function createResumePdf(draft: ResumeDraft): Promise<Blob> {
  if (!canExport(draft))
    throw new Error("Finish the resume review before downloading.");
  pdfMake.addVirtualFileSystem(fonts);
  const content: PdfNode[] = [];
  const add = (text: string, bold = false, fontSize = 11) =>
    content.push({ text: text.trim(), bold, fontSize, margin: [0, 0, 0, 4] });
  const heading = (text: string) =>
    content.push({
      text,
      bold: true,
      fontSize: 11,
      margin: [0, 12, 0, 6],
      headlineLevel: 1,
    });
  if (draft.example) add("FICTIONAL EXAMPLE RESUME", true, 9);
  add(draft.basics.name, true, 16);
  add(
    [
      draft.basics.email,
      draft.basics.phone,
      draft.basics.location,
      draft.basics.links,
    ]
      .filter((value) => value.trim())
      .join(" | "),
    false,
    10,
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
      content.push({
        stack: [
          {
            text: experience.organization.trim(),
            bold: true,
            margin: [0, 5, 0, 2],
          },
          {
            text: `${experience.role.trim()} | ${experience.dates.trim()}`,
            margin: [0, 0, 0, 4],
          },
        ],
      });
      content.push({
        ul: experience.contributions.map((contribution) => ({
          text: contribution.draft.trim(),
          margin: [0, 0, 0, 5],
        })),
        margin: [0, 0, 0, 4],
      });
    }
  }
  if (draft.basics.skills.trim()) {
    heading("SKILLS");
    add(draft.basics.skills);
  }
  return pdfMake
    .createPdf({
      pageSize: "LETTER",
      pageMargins: [36, 36, 36, 36],
      defaultStyle: {
        font: "Roboto",
        fontSize: 11,
        lineHeight: 1.15,
        color: "#000000",
      },
      info: {
        title: draft.example
          ? "Fictional example resume"
          : `${draft.basics.name.trim()} resume`,
        author: draft.basics.name.trim(),
        creator: "AthleteOS",
      },
      pageBreakBefore: (
        node: { headlineLevel?: number; text?: string },
        container: { getFollowingNodesOnPage: () => { text?: unknown }[] },
      ) =>
        node.headlineLevel === 1 &&
        container
          .getFollowingNodesOnPage()
          .filter((item) => typeof item.text === "string" && item.text.trim())
          .length < ("text" in node && node.text === "SKILLS" ? 1 : 3),
      content,
    })
    .getBlob();
}
