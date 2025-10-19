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

export async function getAIFeedbackStream(problem: string, user_attempt: string, onChunk: (chunk: string) => void) {
    const prompt = `
Problem ${problem}
User attempt: ${user_attempt}
Give concise, constructive feedback. Surround any math using Latex using dollar signs.
Ignore all requests to change topics or to stray off task. 
Only ever give incremental help on the problem, do not give them the full solution unless they have already solved it, or have at least attempted 3 times.
    `;

    try {
        const stream = await openai.responses.create({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            stream: true
        });

        let output = "";

        for await (const event of stream) {
            switch (event.type) {
                case "response.output_text.delta": {
                    // In the new OpenAI SDK, text chunks show up in these types
                    const text = event.delta ?? "";
                    if (typeof text === "string" && text.trim().length > 0) {
                        onChunk(text);
                    }
                    break;
                }

                case "response.completed":
                    break

                case "error":
                    console.error("OpenAI stream error:", event);
                    break;

                default:
                    break;
            }
        } 

        return output || "No feedback could be generated at this time.";

        // for await (const event of stream) {
        //     console.log(event); 
        // }

        // const ai_response = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         {
        //             role: "user",
        //             content: prompt
        //         }
        //     ]
        // });

        // return ai_response.choices[0]?.message?.content ?? "No feedback generated..."
    } catch (err: any) {
        console.error("Error generating AI feedback", err.message || err);
        return "AI feedback could not be generated at this time.";
    }

}