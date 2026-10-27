# AthleteOS

A guided resume builder for college athletes applying for internships and first jobs.

The current working version keeps the original AthleteOS page layout and guides the user through five steps:

1. Choose a target role or start with a general resume.
2. Describe personal contributions, with optional details and results.
3. Compare editable bullet drafts with their source facts.
4. Add education, skills, and multiple athletics, work, project, or volunteer entries.
5. Review the complete resume and download Word or PDF.

## Factual wording

Bullet generation is conservative local wording cleanup. There is no connected language model or automatic factual verification. Numbers, qualifiers, role boundaries, and team attribution must be preserved. Changing source facts clears the previous draft. Changing wording or experience details requires a new review. Export is blocked until included entries and the final resume have been reviewed.

The form starts empty. The optional fictional example is labeled in the app and in exported documents. Fixed career match percentages, salary examples, keyword fit scoring, and template outreach are no longer part of the main workflow.

## Draft storage and export

Resume text stays in the browser. Saving is explicit and stores one versioned draft in this browser's local storage, including contact details. Users can load or delete that saved copy. There are no accounts or cloud backups. A loaded draft always requires the final review again.

Word and PDF documents are generated locally in the browser. Export libraries and PDF fonts load only when a download is requested. A print view is also available. Users should review the exported document, including page breaks, before applying.

## Local development

Use Node.js 22.18 or newer (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000/#translator.

## Checks

```sh
npm test
npm run lint
npm run build
```

For a local production review:

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

## Project

- Repository: https://github.com/aborshyov/athleteos
- Published site: https://athleteos-seven.vercel.app/
- Built by Artsiom Barshchou for the OpenAI x Handshake Codex Creator Challenge.

Local changes are reviewed before publishing, so the published site may differ from this working version.
