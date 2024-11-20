import { Hono, Context } from 'hono'

import Groq from 'groq-sdk'

interface Env {
  GROQ_API_KEY: string
}
const app = new Hono()

async function getGroqChatCompletion(groq: Groq, prompt: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-groq-70b-8192-tool-use-preview",
  });
}

app.get('/', async (c: Context<{ "Bindings": Env }>) => {
  const groq = new Groq({ apiKey: c.env.GROQ_API_KEY });
  const url = new URL(c.req.url)
  const params = Object.fromEntries(url.searchParams.entries())

  let output = await getGroqChatCompletion(groq, params['prompt']);

  return c.json({
    message: output.choices[0]?.message?.content || "",
  })
})

export default app
