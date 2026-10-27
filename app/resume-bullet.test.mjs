// Run with Node.js 22.18+ or 24+: node --test app/resume-bullet.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { generateBusinessBullet, translatedBullets, translatorExamples } from "./resume-bullet.ts";

test("all built-in examples remain factual without stock impact claims", () => {
  for (const input of translatorExamples) {
    assert.deepEqual(generateBusinessBullet(input), { bullet: input, feedback: "" });
  }
  assert.deepEqual(translatedBullets.map(({ to }) => to), [
    "Served as assistant captain for a Division I hockey program.",
    "Studied opponents and adjusted game plans.",
    "Balanced travel, training, school, and recovery.",
  ]);
});

test("cleans first person actions without promoting a supporting role", () => {
  assert.equal(generateBusinessBullet("  I helped   organize 2 practices for 8 teammates  ").bullet,
    "Helped organize 2 practices for 8 teammates.");
  assert.equal(generateBusinessBullet("I lead warmups on Fridays").bullet, "Lead warmups on Fridays.");
});

test("preserves negation, uncertainty, goals, tense, and team attribution", () => {
  for (const input of [
    "I did not lead the team.",
    "I wasn't the captain and only helped with setup.",
    "I may have helped reduce delays, but the results were not measured.",
    "I want to mentor younger teammates next season.",
    "Our team raised $500; my role was handing out flyers.",
    "Captain told me to collect equipment.",
    "Assistant captain candidate for next season.",
    "Assistant captain for next season.",
    "I am the assistant captain this season.",
  ]) assert.equal(generateBusinessBullet(input).bullet, input);
});

test("keeps supplied metrics, decimals, abbreviations, and signed values", () => {
  assert.equal(generateBusinessBullet("I tracked a 3.5% change across 12 sessions in the U.S.").bullet,
    "Tracked a 3.5% change across 12 sessions in the U.S.");
  assert.equal(generateBusinessBullet("Recorded -5 and +2 goal differentials").bullet,
    "Recorded -5 and +2 goal differentials.");
});

test("does not create accomplishments from empty or insufficient input", () => {
  for (const input of ["", " \n ", "• ", "...", "12345", "hockey"]) {
    const result = generateBusinessBullet(input);
    assert.equal(result.bullet, "");
    assert.ok(result.feedback);
  }
});

test("handles pasted bullets and wrapped text without joining broken sentences", () => {
  assert.equal(generateBusinessBullet("• I helped plan practice\n• I shared notes with coaches").bullet,
    "Helped plan practice. Shared notes with coaches.");
  assert.equal(generateBusinessBullet("1. I tracked attendance.\n2. I organized equipment.").bullet,
    "Tracked attendance. Organized equipment.");
  assert.equal(generateBusinessBullet("I helped plan\npractice for younger teammates").bullet,
    "Helped plan practice for younger teammates.");
});

test("leaves unfamiliar experience intact instead of inventing business strengths", () => {
  assert.equal(generateBusinessBullet("Repaired skate blades for teammates").bullet,
    "Repaired skate blades for teammates.");
});
