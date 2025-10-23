import { supabase } from "../lib/supabaseClient";
import { initClient } from "@ts-rest/core";
import { contract } from '@student-assistant/shared';

const API_BASE = "http://localhost:3000";

const client = initClient(contract, {
  baseUrl: `${API_BASE}`,
  baseHeaders: {},
});

export async function startSession(topic: string, problem: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("User not logged in.");

  const result = await client.startStudySession({
    body: { topic, problem },
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) return result.body;
  throw new Error(`startSession failed: ${result.status}`);
}

export async function addAttempt(session_id: number, user_attempt: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("Not logged in");

  const result = await client.addAttempt({
    params: { session_id: session_id.toString() },
    body: { user_attempt },
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) return result.body;
  throw new Error(`addAttempt failed: ${result.status}`);
}

export async function getSessions() {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("User not logged in.");

  const result = await client.getStudySessions({
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) return result.body;
  throw new Error(`getSessions failed: ${result.status}`);
}

export async function getAttempts(session_id: number) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("User not logged in.");

  const result = await client.getAttempts({
    params: { session_id: session_id.toString() },
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) return result.body;
  throw new Error(`getAttempts failed: ${result.status}`);
}

// Minimal SSE reader that consumes the server ReadableStream and invokes onChunk(text)
export async function streamAttemptFeedback(
  session_id: number,
  user_attempt: string,
  onChunk: (chunk: string) => void,
) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("User not logged in.");

  const res = await fetch(`${API_BASE}/sessions/${session_id}/stream-attempt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }, 
    body: JSON.stringify({user_attempt}),
  })

  if (res.status !== 200) throw new Error(`Stream request failed: ${res.status}`);
  if (!res.body) throw new Error('Response body is empty; streaming unsupported in this environment');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let events = buffer.split("\n\n");
    buffer = events.pop()!;
    onChunk(buffer);

    // for (const event of events) {
    //   if (event.startsWith("data:")) {
    //     const data = JSON.parse(event.slice(5));
    //     console.log("Chunk:", data.text);
    //   }
    // }
  }
}

export default client;