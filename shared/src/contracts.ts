import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
    startStudySession: {
        method: "POST",
        path: "/sessions/start",
        body: z.object({
            topic: z.string(),
            problem: z.string(),
        }),
        responses: {
            200: z.object({
                id: z.number(),
                topic: z.string(),
                problem: z.string(),
                created_at: z.string(),
            })
        },
        summary: "Starts a new session with a problem and topic."
    },
    
    addAttempt: {
        method: "POST",
        path: "/sessions/:session_id/attempt",
        pathParams: z.object({
            session_id: z.string()
        }),
        body: z.object({
            user_attempt: z.string()  
        }),
        responses: {
            200: z.object({
                attempt_id: z.number(),
                user_attempt: z.string(),
                ai_feedback: z.string(),
                is_correct: z.boolean(),
                created_at: z.string(),
            })
        },
        summary: "User sends a new attempt for AI feedback."
    },
});