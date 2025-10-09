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