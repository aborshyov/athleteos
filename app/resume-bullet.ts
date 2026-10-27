export type ResumeBulletResult = {
  bullet: string;
  feedback: string;
};

const listMarker = /^(?:[-*•]\s+|\d+[.)]\s+)/;
const roleFragment = /^(?:assistant captain|alternate captain|team captain|captain)(?=\s+(?:for|of|on)\b|[.!?]?$)/i;
const pastRole = /^I was (?:the |an? )?((?:assistant captain|alternate captain|team captain|captain)(?=\s+(?:for|of|on)\b|[.!?]?$))/i;
const firstPersonAction = /^I\s+(?=(?:led|lead|helped|help|organized|organize|managed|manage|coordinated|coordinate|studied|study|reviewed|review|analyzed|analyze|trained|train|coached|coach|mentored|mentor|supported|support|balanced|balance|planned|plan|prepared|prepare|tracked|track|shared|share|created|create|built|build|developed|develop|worked|work|played|play|served|serve|assisted|assist|volunteered|volunteer|raised|raise|scheduled|schedule|communicated|communicate|sent|send|checked|check|compared|compare)\b)/i;

function cleanSentence(input: string): string {
  let sentence = input.replace(listMarker, "").trim().replace(/\s+/g, " ");

  // Limit rewriting to explicit roles and action verbs. Keep qualifiers,
  // negation, team attribution, numbers, tense, and unfamiliar wording intact.
  if (pastRole.test(sentence)) {
    sentence = sentence.replace(pastRole, (_, role: string) => `Served as ${role.toLowerCase()}`);
  } else {
    sentence = sentence.replace(firstPersonAction, "");
  }

  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return /[.!?]["'”’)]*$/.test(sentence) ? sentence : `${sentence}.`;
}

/** A local wording cleanup, not an inference engine or a factual verification. */
export function generateBusinessBullet(input: string): ResumeBulletResult {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const content = lines.map((line) => line.replace(listMarker, "")).join(" ").trim();

  if (!content || !/[a-z]/i.test(content)) {
    return { bullet: "", feedback: "Add a responsibility or accomplishment to get started." };
  }

  if (!/\s/.test(content) && !roleFragment.test(content)) {
    return { bullet: "", feedback: "Describe what you did, such as helping plan practice or reviewing game footage." };
  }

  // Join explicit list items as sentences without splitting decimals or names.
  // Ordinary line breaks may just be wrapping, so keep those in one sentence.
  const entries = lines.every((line) => listMarker.test(line)) ? lines : [content];
  return { bullet: entries.map(cleanSentence).join(" "), feedback: "" };
}

export const translatorExamples = [
  "Led offseason training sessions for younger teammates.",
  "Studied opponent power plays and shared adjustments with coaches.",
  "Balanced travel, practice, recovery, and finance coursework.",
];

export const translatedBullets = [
  "I was the assistant captain for a Division I hockey program.",
  "I studied opponents and adjusted game plans.",
  "I balanced travel, training, school, and recovery.",
].map((from) => ({ from, to: generateBusinessBullet(from).bullet }));
