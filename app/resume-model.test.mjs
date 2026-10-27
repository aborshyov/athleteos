import assert from "node:assert/strict";
import { test } from "node:test";
import {
  approveContribution,
  buildContribution,
  canExport,
  createDraft,
  createExampleDraft,
  exportProblems,
  isReviewed,
  parseDraft,
  updateContribution,
  updateExperience,
} from "./resume-model.ts";

function approvedExample() {
  let draft = createExampleDraft();
  const bullet = buildContribution(
    draft.experiences[0].contributions[0],
  ).bullet;
  draft = updateContribution(draft, "experience-1", "contribution-1", {
    draft: bullet,
  });
  draft = approveContribution(draft, "experience-1", "contribution-1");
  return { ...draft, checks: { accuracy: true, relevance: true } };
}

test("a new resume is blank and cannot export a fictional achievement", () => {
  const draft = createDraft();
  assert.equal(draft.example, false);
  assert.equal(draft.basics.name, "");
  assert.equal(
    buildContribution(draft.experiences[0].contributions[0]).bullet,
    "",
  );
  assert.equal(canExport(draft), false);
});
test("optional results are not required and no outcome is invented", () => {
  const draft = approvedExample();
  assert.equal(draft.experiences[0].contributions[0].result, "");
  assert.equal(
    draft.experiences[0].contributions[0].draft,
    "Helped plan 2 preseason practices for 8 teammates. Sent schedules and checked attendance.",
  );
  assert.equal(canExport(draft), true);
});
test("wording preserves individual support, team results, qualifiers, and numbers", () => {
  const contribution = {
    ...createDraft().experiences[0].contributions[0],
    action: "I helped review 12 sessions with a 3.5% change.",
    detail: "Our team raised $500; my role was handing out flyers.",
    result: "I may have helped, but the result was not measured.",
  };
  assert.equal(
    buildContribution(contribution).bullet,
    "Helped review 12 sessions with a 3.5% change. Our team raised $500; my role was handing out flyers. I may have helped, but the result was not measured.",
  );
});
test("editing a source fact clears stale wording and both final checks", () => {
  const changed = updateContribution(
    approvedExample(),
    "experience-1",
    "contribution-1",
    { action: "I helped 3 teammates." },
  );
  assert.equal(changed.experiences[0].contributions[0].draft, "");
  assert.deepEqual(changed.checks, { accuracy: false, relevance: false });
  assert.equal(canExport(changed), false);
});
test("editing wording or role requires a new review", () => {
  const draft = approvedExample();
  assert.equal(
    isReviewed(draft.experiences[0], draft.experiences[0].contributions[0]),
    true,
  );
  for (const changed of [
    updateContribution(draft, "experience-1", "contribution-1", {
      draft: "Changed wording.",
    }),
    updateExperience(draft, "experience-1", { role: "Assistant captain" }),
  ]) {
    assert.equal(
      isReviewed(
        changed.experiences[0],
        changed.experiences[0].contributions[0],
      ),
      false,
    );
    assert.equal(canExport(changed), false);
  }
});
test("excluding the only experience cannot produce an empty resume", () => {
  const draft = updateExperience(approvedExample(), "experience-1", {
    included: false,
  });
  assert.ok(exportProblems(draft).includes("Include at least one experience."));
});
test("saved drafts preserve facts and valid bullet reviews but repeat final checks", () => {
  const draft = approvedExample();
  const loaded = parseDraft(JSON.stringify(draft));
  assert.deepEqual(loaded.basics, draft.basics);
  assert.deepEqual(loaded.experiences, draft.experiences);
  assert.deepEqual(loaded.checks, { accuracy: false, relevance: false });
  assert.equal(canExport(loaded), false);
  loaded.experiences[0].contributions[0].action = "Different facts.";
  assert.equal(
    isReviewed(loaded.experiences[0], loaded.experiences[0].contributions[0]),
    false,
  );
});
test("unsupported, corrupt, oversized, and duplicate-identifier saves are rejected", () => {
  assert.throws(() => parseDraft("bad json"));
  assert.throws(() =>
    parseDraft(JSON.stringify({ ...createDraft(), version: 2 })),
  );
  assert.throws(() => parseDraft(" ".repeat(500001)));
  const draft = createDraft();
  draft.experiences[0].contributions[0].id = draft.experiences[0].id;
  assert.throws(() => parseDraft(JSON.stringify(draft)));
});
test("excluded drafts stay out of export checks while every included bullet is checked", () => {
  const draft = approvedExample();
  const other = structuredClone(createDraft().experiences[0]);
  other.id = "other";
  other.contributions[0].id = "other-bullet";
  other.included = false;
  draft.experiences.push(other);
  assert.equal(canExport(draft), true);
  draft.experiences[1].included = true;
  assert.equal(canExport(draft), false);
});
test("blank or one-word actions cannot be approved through optional details", () => {
  for (const action of ["", "hockey", "12345", "..."]) {
    const contribution = {
      ...createDraft().experiences[0].contributions[0],
      action,
      detail: "I helped plan practices.",
      draft: "Invented content.",
    };
    assert.equal(buildContribution(contribution).bullet, "");
    const draft = createDraft();
    draft.experiences[0].contributions = [contribution];
    assert.equal(
      isReviewed(
        approveContribution(draft, "experience-1", "contribution-1")
          .experiences[0],
        contribution,
      ),
      false,
    );
  }
});
