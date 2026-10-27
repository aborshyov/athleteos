import assert from "node:assert/strict";
import { test } from "node:test";
import { createResumeDocx } from "./resume-docx.ts";
import { createResumePdf } from "./resume-pdf.ts";
import { approveContribution, buildContribution, createDraft, createExampleDraft, updateContribution } from "./resume-model.ts";

function reviewedExample() {
  let draft = createExampleDraft();
  draft.basics.name = "Example José Lee";
  draft = updateContribution(draft, "experience-1", "contribution-1", { draft: buildContribution(draft.experiences[0].contributions[0]).bullet });
  draft = approveContribution(draft, "experience-1", "contribution-1");
  return { ...draft, checks: { accuracy: true, relevance: true } };
}

test("Word export produces a real document archive after review", async () => {
  const blob = await createResumeDocx(reviewedExample());
  assert.ok(blob.size > 2000);
  assert.deepEqual([...new Uint8Array(await blob.slice(0, 4).arrayBuffer())], [80, 75, 3, 4]);
});
test("PDF export produces a PDF locally after review", async () => {
  const blob = await createResumePdf(reviewedExample());
  assert.ok(blob.size > 2000);
  assert.equal(await blob.slice(0, 5).text(), "%PDF-");
});
test("both exporters reject missing reviews and changes after approval", async () => {
  const changed = updateContribution(reviewedExample(), "experience-1", "contribution-1", { detail: "Changed facts." });
  for (const create of [createResumeDocx, createResumePdf]) {
    for (const draft of [createDraft(), changed, { ...reviewedExample(), checks: { accuracy: false, relevance: true } }]) await assert.rejects(create(draft), /Finish the resume review/);
  }
});
