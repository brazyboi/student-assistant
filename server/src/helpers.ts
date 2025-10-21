import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Get the user ID from the JWT
export async function getUserIdFromToken(authHeader?: string) {
    if (!authHeader) {
        throw new Error("Missing authorization header.")
    }

    const token = authHeader.replace("Bearer ", "");

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
        const ai_response = await openai.chat.completions.create({
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
        // const stream = await openai.responses.create({
        //     model: "gpt-4o-mini",
        //     input: [
        //         {
        //             role: "user",
        //             content: prompt,
        //         }
        //     ],
        //     stream: true
        // });
        
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
        const chunks = ["Hello", "world", "this", "is", "streaming"];

        const readable = new ReadableStream({
            async start(controller) {
                try { 
                    for (const chunk of chunks) {
                        controller.enqueue(new TextEncoder().encode(chunk));
                        await new Promise(res => setTimeout(res, 100)); // optional, simulate delay
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