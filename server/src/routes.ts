import { contract } from "shared/contracts";
import pool from "./db";
import { getAIFeedback, getUserIdFromToken } from "./helpers";
import { initServer } from "@ts-rest/express";

const s = initServer();

export const router = s.router(contract, {
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
            `SELECT problem FROM study_sessions WHERE id = $1`,
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
    }
});

export default router;