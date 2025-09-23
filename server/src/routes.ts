import express from 'express';
import type { Request, Response } from 'express';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import pool from './db.ts';

const router = express.Router();

async function getAIResponse(
  conversation: { role: 'user' | 'system'; content: string }[],
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: conversation }),
  });

  const data = (await response.json()) as { choices: { message: { content: string } }[] };
  if ('error' in data) return 'AI Error: ' + (data as any).error.message;
  return data.choices?.[0]?.message?.content || 'AI No Reply.';
}

// Create a new profile
router.post('/profiles', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO profiles (email, password) VALUES ($1, $2) RETURNING id, email', [
      email,
      hashedPassword,
    ]);
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Database error inserting profile' });
  }
});

// Login a profile
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log("Login endpoint hit", req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const result = await pool.query('SELECT id, email, password FROM profiles WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ id: user.id, email: user.email });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Database error logging in' });
  }
});

// Save a chat for a profile
// Save a chat for a profile (creates chat row, then inserts messages)
router.post('/chats', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { profileId, title, messages } = req.body as {
      profileId: number;
      title?: string;
      messages?: { sender: string; text: string }[];
    };

    await client.query('BEGIN');
    const chatResult = await client.query(
      'INSERT INTO chats (profile_id, title) VALUES ($1, $2) RETURNING id, created_at',
      [profileId, title]
    );
    const chatId = chatResult.rows[0].id;

    if (Array.isArray(messages) && messages.length > 0) {
      const insertPromises = messages.map((m) => {
        return client.query('INSERT INTO messages (chat_id, sender, text) VALUES ($1, $2, $3)', [
          chatId,
          m.sender,
          m.text,
        ]);
      });
      await Promise.all(insertPromises);
    }

    await client.query('COMMIT');
    res.json({ id: chatId });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error saving chat' });
  } finally {
    client.release();
  }
});

// Get all chats for a profile
router.get('/chats/:profileId', async (req: Request, res: Response) => {
  try {
    const profileId = req.params.profileId;
    const chatsResult = await pool.query('SELECT id, profile_id, title, created_at FROM chats WHERE profile_id = $1 ORDER BY created_at DESC', [
      profileId,
    ]);
    const chats = chatsResult.rows;

    // Fetch messages for each chat
    const chatIds = chats.map((c) => c.id);
    if (chatIds.length === 0) return res.json([]);

    const messagesResult = await pool.query(
      'SELECT id, chat_id, sender, text, created_at FROM messages WHERE chat_id = ANY($1::int[]) ORDER BY created_at ASC',
      [chatIds]
    );

    const messagesByChat: Record<number, any[]> = {};
    for (const m of messagesResult.rows) {
      let arr = messagesByChat[m.chat_id];
      if (!arr) {
        arr = [];
        messagesByChat[m.chat_id] = arr;
      }
      arr.push({ id: m.id, sender: m.sender, text: m.text, created_at: m.created_at });
    }

    const payload = chats.map((c) => ({ ...c, messages: messagesByChat[c.id] || [] }));
    res.json(payload);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching chats' });
  }
});

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: { role: 'user' | 'system'; content: string }[] };
    const reply = await getAIResponse(messages);
    res.json({ reply });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
