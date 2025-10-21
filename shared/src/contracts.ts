import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const StudySessionSchema = z.object({
    id: z.number(),
    topic: z.string(),
    problem: z.string(),
    created_at: z.string(),
});

const AttemptSchema = z.object({
    attempt_id: z.number(),
    user_attempt: z.string(),
    ai_feedback: z.string(),
    is_correct: z.boolean(),
    created_at: z.string(),
});

export const contract = c.router({
    // GET requests
    getStudySessions: {
        method: "GET",
        path: "/sessions",
        responses: {
            200: z.array(StudySessionSchema)
        },
        summary: "Gets all the sessions belonging to a user."
    },
    getAttempts: {
        method: "GET",
        path: "/sessions/:session_id/attempts",
        pathParams: z.object({
            session_id: z.string()
        }),
        responses: {
            200: z.array(AttemptSchema)
        },
        summary: "Gets all the user attempts pertaining to a certain session."
    },
    // POST requests
    startStudySession: {
        method: "POST",
        path: "/sessions/start",
        body: z.object({
            topic: z.string(),
            problem: z.string(),
        }),
        responses: {
            200: StudySessionSchema 
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
            200: AttemptSchema 
        },
        summary: "User sends a new attempt for AI feedback."
    },
    streamAttemptFeedback : {
        method: "POST",
        path: "/sessions/:session_id/stream-attempt",
        pathParams: z.object({
            session_id: z.string()
        }),
        body: z.object({
            user_attempt: z.string()
        }),
        responses: {
            200: z.unknown()
            // 200: z.string()
        },
        summary: "Streams the AI feedback message in chunks in real time.",
    }
});