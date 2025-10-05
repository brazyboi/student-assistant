import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.ts';
import pool from './db.ts';
import { createExpressEndpoints } from '@ts-rest/express';
import { contract } from '@student-assistant/shared';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

createExpressEndpoints(contract, router, app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// (async () => {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS profiles (
//       id SERIAL PRIMARY KEY,
//       email TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL
//     );

//     CREATE TABLE IF NOT EXISTS chats (
//       id SERIAL PRIMARY KEY,
//       profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
//       title TEXT,
//       created_at TIMESTAMP DEFAULT NOW()
//     );
    
//     CREATE TABLE IF NOT EXISTS messages (
//       id SERIAL PRIMARY KEY, 
//       chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
//       sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
//       text TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT NOW()
//     )
//   `);
// })();
