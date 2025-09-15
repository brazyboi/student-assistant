import express from 'express';
import type { Request, Response } from 'express';
import fetch from 'node-fetch';
import cors from 'cors'
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from "bcrypt";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Set this in your .env file
});


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

// Create a new profile
app.post("/api/profiles", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO profiles (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    // Don’t return the password hash in the response
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Database error inserting profile" });
  }
});

// // Get all profiles
// app.get('/api/profiles', async (req: Request, res: Response) => {
//   const limit = parseInt(req.query.limit as string) || 50;
//   const offset = parseInt(req.query.offset as string) || 0;
//   const result = await pool.query('SELECT * FROM profiles LIMIT $1 OFFSET $2', [limit, offset]);
//   res.json(result.rows);
// });

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Look up the user by email
    const result = await pool.query("SELECT id, email, password FROM profiles WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Success — return user info (without password)
    res.json({ id: user.id, email: user.email });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Database error logging in" });
  }
});

// Save a chat for a profile
app.post('/api/chats', async (req: Request, res: Response) => {
  try {
    const { profileId, title, messages } = req.body;
    const result = await pool.query(
      'INSERT INTO chats (profile_id, title, messages) VALUES ($1, $2, $3) RETURNING id',
      [profileId, title, JSON.stringify(messages)]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error saving chat' });
  }
});

// Get all chats for a profile
app.get('/api/chats/:profileId', async (req: Request, res: Response) => {
  const result = await pool.query(
    'SELECT * FROM chats WHERE profile_id = $1',
    [req.params.profileId]
  );
  res.json(result.rows);
});

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { messages, mode, hintIndex } = req.body as { 
          messages: { role: "user" | "system"; content: string }[]; 
          mode: 'question' | 'hint' | 'answer' | 'explanation'; 
          hintIndex?: number 
        };

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

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT,
      messages JSONB
    );
  `);
})();
