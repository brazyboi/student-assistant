import type {Chat, QueryMode} from "../types";

// export async function retrieveSessions (

// ) {
//   fetch('/api/sessions', {
//     headers: { 'Authorization', `Bearer ${supabaseAuthToken}`}
//   })
// }

export async function sendMessage(
  chat: Chat, 
  userMessage: string | null,
  mode: QueryMode,
  hintIndex = 1
): Promise<string> {
  const history = (chat?.messages ?? []).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'system',
    content: msg.text,
  }));

  const systemPrompt = `
    You are an expert Socratic tutor.
    Your task is to guide students to find answers on their own through questions.
    Do not provide direct answers unless explicitly asked for a solution.
    If the student asks for a hint (if mode = "hint"), provide a subtle nudge.
    If the student asks for a solution (if mode = "solution"), provide a clear, step-by-step solution.
    If the mode = "question", save this question in context and respond that you have noted it. This will be the main problem we will work on.
    Additionally, never go off topic from the subject of the question. If they ask something unrelated, steer themn back to the topic of the question.
  `;

  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // systemPrompt,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        ...(userMessage ? [{ role: "user", content: userMessage }] : []),
      ],
      mode,
      hintIndex,
    }),
  });

  const data = await response.json() as { reply: string };
  if ('error' in data) {
    return "AI Error: " + (data as any).error.message;
  }
  return data.reply || "AI No Reply.";
}