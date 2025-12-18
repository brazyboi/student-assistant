import { createClient } from "@supabase/supabase-js";
import { addNote, searchUserNotes } from "./noteHandler.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from 'dotenv';
import { Readable } from 'stream';


dotenv.config();

let supabase: SupabaseClient;

export function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

let openai : OpenAI

export function getOpenAIClient() {
    if (!openai) {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error('Missing OPENAI_API_KEY env');
        }

        openai = new OpenAI({ apiKey });
    }
    return openai;
}

// Get the user ID from the JWT
export async function getUserIdFromToken(authHeader?: string) {
    if (!authHeader) {
        throw new Error("Missing authorization header.")
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw new Error("Invalid token.");
    return data.user.id;
}

async function buildPromptWithContext(userId: string, problem: string, user_attempt: string) {
    const context = await searchUserNotes(userId, problem);

    let systemInstruction = "You are a helpful student assistant.";
    if (context) {
        systemInstruction += `\n\nRefer to the following User Notes when helping:\n${context}`;
    }

    const userMessage = `
    Problem: ${problem}
    Student Attempt: ${user_attempt}
    Give concise, constructive feedback. Surround any math using Latex using dollar signs.
    `;

    return { systemInstruction, userMessage };
}

export async function getAIFeedback(userId: string, problem: string, user_attempt: string) {
    try {
        const { systemInstruction, userMessage } = await buildPromptWithContext(userId, problem, user_attempt);
        const openaiClient = getOpenAIClient();
        const ai_response = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userMessage }
            ]
        });

        return ai_response.choices[0]?.message?.content ?? "No feedback generated..."
    } catch (err: any) {
        console.error("Error generating AI feedback", err.message || err);
        return "AI feedback could not be generated at this time.";
    }
}

function webStreamToNode(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  return new Readable({
    async read() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null); // end stream
          break;
        }
        this.push(Buffer.from(value));
      }
    },
  });
}

export async function getAIFeedbackStream(userId: string, problem: string, user_attempt: string, onChunk: (chunk: string) => void) {
    try {
        const { systemInstruction, userMessage } = await buildPromptWithContext(userId, problem, user_attempt);
        const openaiClient = getOpenAIClient();
        const stream = await openaiClient.responses.create({
            model: "gpt-4o-mini",
            input: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userMessage }
            ],
            stream: true
        });
        
        const readable = new ReadableStream({
            async start(controller) {
                try { 
                    for await (const event of stream) {
                        switch (event.type) {
                            case "response.output_text.delta":
                                const content = event.delta || "";
                                const sseChunk = `data:${content}\n\n`
                                controller.enqueue(new TextEncoder().encode(sseChunk));
                                break;
                            default:
                                break;
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return webStreamToNode(readable);
        
    } catch (err: any) {
        console.error("Error generating AI feedback", err.message || err);
        const readable = new ReadableStream({
            async start(controller) {
                controller.enqueue("AI feedback could not be generated at this time");
                controller.close();
            }
        })
        return webStreamToNode(readable);
    }

}