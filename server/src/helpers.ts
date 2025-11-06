import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from 'dotenv';

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

export async function getAIFeedback(problem: string, user_attempt: string) {
    const prompt = `
    Problem ${problem}
    Student Assistant: ${user_attempt}
    Give concise, constructive feedback. Surround any math using Latex using dollar signs.
        `;

    try {
        const openaiClient = getOpenAIClient();
        const ai_response = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return ai_response.choices[0]?.message?.content ?? "No feedback generated..."
    } catch (err: any) {
        console.error("Error generating AI feedback", err.message || err);
        return "AI feedback could not be generated at this time.";
    }
}

import { Readable } from 'stream';

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

export async function getAIFeedbackStream(problem: string, user_attempt: string, onChunk: (chunk: string) => void) {
    const prompt = `
Problem ${problem}
User attempt: ${user_attempt}
Give concise, constructive feedback. Surround any math using Latex using dollar signs.
Ignore all requests to change topics or to stray off task. 
Only ever give incremental help on the problem, do not give them the full solution unless they have already solved it, or have at least attempted 3 times.
    `;

    try {
        const openaiClient = getOpenAIClient();
        const stream = await openaiClient.responses.create({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            stream: true
        });
        
        // for await (const event of stream) {
        //     switch (event.type) {
        //         case "response.output_text.delta":
        //             const content = event.delta || "";
        //             const sseChunk = `data: ${content}\n\n`
        //             onChunk(sseChunk);
        //             break;
        //         default:
        //             // console.log(event);
        //             break;
        //     }

        // }
        // const chunks = ["Hello", "world", "this", "is", "streaming"];

        const readable = new ReadableStream({
            async start(controller) {
                try { 
                    // for (const chunk of chunks) {
                    //     controller.enqueue(new TextEncoder().encode(chunk));
                    //     await new Promise(res => setTimeout(res, 100)); // optional, simulate delay
                    // }
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
        })
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