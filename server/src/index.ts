import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.ts';
import pool from './db.ts';
import { createExpressEndpoints } from '@ts-rest/express';
import { contract } from '@student-assistant/shared';
import redisRateLimiter from './middleware/redisRateLimiter';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Apply Redis-backed rate limiter globally
app.use(redisRateLimiter);

createExpressEndpoints(contract, router, app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});