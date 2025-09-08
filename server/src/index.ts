import express from 'express';
import type { Request, Response } from 'express';
import fetch from 'node-fetch';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function getAIResponse(
    conversation: { role: "user" | "system"; content: string }[],
) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: conversation,
        }),
    });

    const data = await response.json() as { choices: { message: { content: string } }[] };
    
    if ('error' in data) {
        return "AI Error: " + (data as any).error.message;
    }

    return data.choices?.[0]?.message?.content || "AI No Reply.";
}

// async function getAIResponse(query: string, mode: 'question' | 'hint' | 'solution', hintIndex = 1) {
//     const systemPrompt = `
//         You are an expert Socratic tutor.
//         Your task is to guide students to find answers on their own through questions.
//         Do not provide direct answers unless explicitly asked for a solution.
//         If the student asks for a hint (if mode = "hint"), provide a subtle nudge towards the answer.
//         If the student asks for a solution (if mode = "solution), provide a clear and concise answer, fully worked out and step by step.
//         If the mode = "question", always respond with a question that encourages critical thinking.
//         Always encourage critical thinking and exploration.
//     `

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [
//                 { role: "system", content: systemPrompt },
//             ]
//         }),
//     });

//     const data = await response.json() as { choices: { message: { content: string } }[] };
    
//     if ('error' in data) {
//         return "AI Error: " + (data as any).error.message;
//     }

//     return data.choices?.[0]?.message?.content || "AI No Reply.";
// }

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { messages, mode, hintIndex } = req.body as { messages: { role: "user" | "system"; content: string }[]; mode: 'question' | 'hint' | 'solution'; hintIndex?: number };

        const reply = await getAIResponse(messages);
        res.json({reply: reply});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});