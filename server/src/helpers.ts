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

// Sends a request to an AI (openAI for now), and returns the AI feedback content.
export async function getAIFeedback(problem: string, user_attempt: string) {
    const prompt = `
Problem ${problem}
Student Assistant: ${user_attempt}
Give concise, constructive feedback. 
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