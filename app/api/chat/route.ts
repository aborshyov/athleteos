import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are AthleteAI Career OS.

You help a professional hockey player transition into AI, finance, and business careers.

You help with:
- resumes
- LinkedIn outreach
- interview prep
- AI project work
- career strategy
- productivity

User message:
${message}
`,
  });

  return Response.json({
    answer: response.output_text,
  });
}