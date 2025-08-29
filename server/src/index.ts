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

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { message } = req.body as { message: string };
        const response =  await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                }, 
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: message }],
                }),
            }
        );
        const data = await response.json() as {
            choices: { message: { content: string } }[];
        };

        const reply = data.choices?.[0]?.message?.content || "AI No Reply.";
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});