import Groq from "groq-sdk";

let groqClient;

const getClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
};

export const requestGroqCompletion = async ({ messages, temperature = 0.5, maxTokens = 700 }) => {
  const client = getClient();

  if (!client) {
    return null;
  }

  const completion = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    messages,
    temperature,
    max_tokens: maxTokens
  });

  return completion.choices?.[0]?.message?.content || "";
};
