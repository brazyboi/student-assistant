import { supabase } from "./supabaseClient";
import { initClient } from "@ts-rest/core";
import { contract } from '@student-assistant/shared';

const API_BASE = "http://localhost:3000";

const client = initClient(contract, {
  baseUrl: `${API_BASE}`,
  baseHeaders: {},
});

export async function startSession(topic: string, problem: string) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) throw new Error("User not logged in.");

    const result = await client.startStudySession({
      body: { topic, problem },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    if (result.status === 200) {
      console.log("Session created:", result.body);
      return result.body; // id, topic, problem, created_at
    } else {
      console.error("Failed to start session:", result.status);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function addAttempt(session_id: number, user_attempt: string) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) throw new Error("Not logged in");

    const result = await client.addAttempt({
      params: { session_id: session_id.toString() },
      body: { user_attempt: user_attempt },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    if (result.status === 200) {
      console.log("Attempt saved:", result.body);
      return result.body; // attempt_id, ai_feedback, etc.
    } else {
      console.error("Failed to add attempt:", result.status);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getSessions() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) throw new Error("User not logged in.");

    const result = await client.getStudySessions({
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    if (result.status === 200) {
      return result.body; 
    } else {
      console.error("Could not get sessions.", result.status);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getAttempts(session_id: number) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) throw new Error("User not logged in.");
    
    const result = await client.getAttempts({
      params: { session_id: session_id.toString() },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    if (result.status === 200) {
      return result.body;
    } else {
      console.error("Could not get attempts.", result.status);
    }
  } catch (err) {
    console.error(err);
  }
}




// import type {Chat, QueryMode} from "../types";

// export async function retrieveSessions (

// ) {
//   fetch('/api/sessions', {
//     headers: { 'Authorization', `Bearer ${supabaseAuthToken}`}
//   })
// }

// export async function sendMessage(
//   chat: Chat, 
//   userMessage: string | null,
//   mode: QueryMode,
//   hintIndex = 1
// ): Promise<string> {
//   const history = (chat?.messages ?? []).map(msg => ({
//     role: msg.sender === 'user' ? 'user' : 'system',
//     content: msg.text,
//   }));

//   const systemPrompt = `
//     You are an expert Socratic tutor.
//     Your task is to guide students to find answers on their own through questions.
//     Do not provide direct answers unless explicitly asked for a solution.
//     If the student asks for a hint (if mode = "hint"), provide a subtle nudge.
//     If the student asks for a solution (if mode = "solution"), provide a clear, step-by-step solution.
//     If the mode = "question", save this question in context and respond that you have noted it. This will be the main problem we will work on.
//     Additionally, never go off topic from the subject of the question. If they ask something unrelated, steer themn back to the topic of the question.
//   `;

//   const response = await fetch('http://localhost:3000/api/chat', {
//     method: 'POST',
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       // systemPrompt,
//       messages: [
//         { role: "system", content: systemPrompt },
//         ...history,
//         ...(userMessage ? [{ role: "user", content: userMessage }] : []),
//       ],
//       mode,
//       hintIndex,
//     }),
//   });

//   const data = await response.json() as { reply: string };
//   if ('error' in data) {
//     return "AI Error: " + (data as any).error.message;
//   }
//   return data.reply || "AI No Reply.";
// }