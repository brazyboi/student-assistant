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

    // Socratic system prompt - enforce pedagogical approach
    let systemInstruction = `You are a Socratic tutor AI. Guide the student step by step WITHOUT giving the solution unless explicitly allowed.

CORE PRINCIPLES:
1. Ask questions first. Help students think through problems, not just solve them.
2. Reference student input directly in your questions. Show you've read their work.
3. Praise effort, not just correctness.
4. Never give full solutions unless the student explicitly says "I'm stuck, show me the solution."

CRITICAL FORMATTING RULES:
1. Math: ALWAYS surround math expressions with single dollar signs (e.g., $x^2$).
2. Code: Surround code with triple backticks.
3. Spacing: Use a blank line before AND after every heading.
   Example:
   
   [Previous paragraph]
   
   ### Heading Name
   
   [Next paragraph]
`;

    if (context) {
        systemInstruction += `\n\nRefer to the following User Notes when helping:\n${context}`;
    }

    // Keep user message focused on the input data
    const userMessage = `
    Problem: ${problem}
    Student Attempt: ${user_attempt}
    
    Task: Respond with a guiding question or encouragement based on their attempt. Do NOT solve the problem.
    `;

    return { systemInstruction, userMessage };
}

async function buildHintPrompt(userId: string, problem: string, user_attempt: string, hintLevel: "conceptual" | "guiding" | "partial") {
    const context = await searchUserNotes(userId, problem);

    let systemInstruction = `You are a Socratic tutor AI providing a ${hintLevel} hint.

HINT LEVELS:
- conceptual: Explain underlying concept or key idea (no solution approach yet)
- guiding: Ask a guiding question to lead student toward solution method
- partial: Show a partial step or partial work as an example (not the full solution)

Your hint should:
1. Match the specified level exactly
2. Reference the student's previous work
3. Be brief (2-3 sentences max for conceptual, 1 question for guiding, 1-2 partial steps)
4. Not give away the full solution

CRITICAL FORMATTING:
1. Math: ALWAYS surround with single dollar signs (e.g., $x^2$).
2. Code: Use triple backticks.
3. Keep spacing between sections.
`;

    if (context) {
        systemInstruction += `\n\nUser Notes:\n${context}`;
    }

    const userMessage = `
    Problem: ${problem}
    Student's Attempt: ${user_attempt}
    Hint Level: ${hintLevel}
    
    Provide ONLY the ${hintLevel} hint. Keep it concise.
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

export async function getSocraticHint(userId: string, problem: string, user_attempt: string, hintLevel: "conceptual" | "guiding" | "partial") {
    try {
        const { systemInstruction, userMessage } = await buildHintPrompt(userId, problem, user_attempt, hintLevel);
        const openaiClient = getOpenAIClient();
        const ai_response = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userMessage }
            ]
        });

        return ai_response.choices[0]?.message?.content ?? "Hint could not be generated.";
    } catch (err: any) {
        console.error("Error generating hint", err.message || err);
        return "Hint could not be generated at this time.";
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
        console.log(systemInstruction);
        console.log(userMessage);
        const openaiClient = getOpenAIClient();
        const stream = await openaiClient.responses.create({
            model: "gpt-4o-mini",
            instructions: systemInstruction,
            input: userMessage,
            stream: true
        });
        
        const readable = new ReadableStream({
            async start(controller) {
                try { 
                    for await (const event of stream) {
                        switch (event.type) {
                            case "response.output_text.delta":
                                const content = event.delta || "";
                                const sseChunk = `data: ${JSON.stringify({ text: content })}\n\n`; 
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