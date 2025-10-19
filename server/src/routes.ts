import { contract } from "@student-assistant/shared";
import pool from "./db.ts";
import { getAIFeedback, getAIFeedbackStream, getUserIdFromToken } from "./helpers.ts";
import { initServer } from "@ts-rest/express";

const s = initServer();

export const router = s.router(contract, {
    // GET requests
    getStudySessions: async ({ headers }) => {
        const user_id = await getUserIdFromToken(headers.authorization);

        const result = await pool.query(
            `SELECT id, topic, problem, created_at
            FROM study_sessions
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [user_id]
        );

        return {
            status: 200,
            body: result.rows
        }
    },
    getAttempts: async ({ params, headers }) => {
        const user_id = await getUserIdFromToken(headers.authorization); 
        const session_id = parseInt(params.session_id);

        const session_res = await pool.query(
            `SELECT user_id FROM study_sessions WHERE id = $1`,
            [session_id]
        );

        if (session_res.rows.length === 0) {
            throw new Error("Session not found.")
        };

        if (session_res.rows[0].user_id !== user_id) {
            throw new Error("Incorrect user to session pair.");
        }

        const result = await pool.query(
            `SELECT id AS attempt_id, user_attempt, ai_feedback, is_correct, created_at
            FROM attempts
            WHERE session_id = $1
            ORDER BY created_at DESC`,
            [session_id]
        );

        return {
            status: 200,
            body: result.rows
        };
    }, 

    // POST requests
    startStudySession: async ({ body: {topic, problem}, headers }) => {
        const user_id = await getUserIdFromToken(headers.authorization);

        const result = await pool.query(
            `INSERT INTO study_sessions (user_id, topic, problem)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [user_id, topic, problem]
        );

        return { 
            status: 200, 
            body: result.rows[0] 
        };
    },
    addAttempt: async ({ body: { user_attempt }, params, headers }) => {
        const user_id = await getUserIdFromToken(headers.authorization);
        const session_id = parseInt(params.session_id);
        const session_res = await pool.query(
            `SELECT user_id, problem FROM study_sessions WHERE id = $1`,
            [session_id]
        );

        if (session_res.rows.length === 0) {
            throw new Error("Session not found.")
        };

        // verify user owns session
        if (session_res.rows[0].user_id !== user_id) {
            throw new Error("Incorrect user to session pair.");
        }

        const problem = session_res.rows[0].problem;
        const ai_feedback = await getAIFeedback(problem, user_attempt);

        // store attempt
        const result = await pool.query(
            `INSERT INTO attempts (session_id, user_attempt, ai_feedback, is_correct)
            VALUES ($1, $2, $3, $4) RETURNING id, user_attempt, ai_feedback, is_correct, created_at`,
            [session_id, user_attempt, ai_feedback, null]
        );
        const row = result.rows[0];

        return {
            status: 200,
            body: {
                attempt_id: row.id,
                user_attempt: row.user_attempt,
                ai_feedback: row.ai_feedback,
                is_correct: row.is_correct,
                created_at: row.created_at,
            }
       }
    },
    streamAttemptFeedback: async ({ body: { user_attempt }, params, headers }) => {
        const user_id = await getUserIdFromToken(headers.authorization);
        const session_id = parseInt(params.session_id);

        const session_res = await pool.query(
            `SELECT user_id, problem FROM study_sessions WHERE id = $1`,
            [session_id]
        );

        if (session_res.rows.length === 0) {
            throw new Error("Session not found");
        }

        if (session_res.rows[0].user_id !== user_id) {
            throw new Error("Unauthorized");
        }

        const problem = session_res.rows[0].problem;

        // Return a response with stream
        return {
            status: 200,
            // Set headers for SSE
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            },
            // Return a ReadableStream that emits chunks
            body: new ReadableStream({
                async start(controller) {
                    try {
                        await getAIFeedbackStream(problem, user_attempt, (chunk) => {
                            // Push each chunk as an SSE event
                            controller.enqueue(`data: ${JSON.stringify({ text: chunk })}\n\n`);
                        });
                        
                        // Signal end of stream
                        controller.enqueue('event: end\ndata: {}\n\n');
                        controller.close();
                    } catch (err) {
                        console.error("Streaming error:", err);
                        controller.enqueue(`event: error\ndata: ${JSON.stringify({ error: "AI error" })}\n\n`);
                        controller.close();
                    }
                }
            })
        };
    },
});

export default router;