import { supabase } from "../lib/supabaseClient";
import { initClient } from "@ts-rest/core";
import { contract } from '@student-assistant/shared';
import type { HintLevel } from '@/lib/types';

const API_BASE = import.meta.env.VITE_API_URL;

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

export async function getHint(session_id: number | string, user_attempt: string, current_hint_level: HintLevel) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("User not logged in.");

  const result = await client.getHint({
    params: { session_id: session_id.toString() },
    body: { user_attempt, current_hint_level },
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) return result.body;
  throw new Error(`getHint failed: ${result.status}`);
}

// Minimal SSE reader that consumes the server ReadableStream and invokes onChunk(text)
export async function streamAttemptFeedback(
  session_id: number | string,
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
    body: JSON.stringify({ user_attempt }),
  });

  if (res.status !== 200) throw new Error(`Stream request failed: ${res.status}`);
  if (!res.body) throw new Error('Response body is empty; streaming unsupported');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = ""; // Buffer to hold incomplete chunks

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 1. APPEND to buffer, don't overwrite
    buffer += decoder.decode(value, { stream: true });

    // 2. Split by the SSE delimiter
    const parts = buffer.split("\n\n");

    // 3. Keep the last part in the buffer (it might be incomplete)
    //    pop() removes the last element from 'parts' and returns it
    buffer = parts.pop() || "";

    // 4. Process all complete messages
    for (const part of parts) {
      if (part.startsWith("data: ")) {
        const jsonString = part.slice(6); // Remove "data: " prefix
        try {
          // Parse the JSON to safely extract text with newlines (\n) preserved
          const parsed = JSON.parse(jsonString);
          console.log(parsed);
          if (parsed.text) {
             onChunk(parsed.text);
          }
        } catch (err) {
          console.error("Error parsing SSE JSON:", err);
        }
      }
    }
  }
}

export default client;