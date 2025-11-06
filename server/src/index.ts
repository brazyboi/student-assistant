import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';
import pool from './db.js';
import { createExpressEndpoints } from '@ts-rest/express';
import { contract } from '@student-assistant/shared';
import { rateLimiterMiddleware } from './redisRateLimiter.js';


// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });


const app = express();

// ========================================
// SERVE STATIC CLIENT FILES (Production only)
// ========================================
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction ? false : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(rateLimiterMiddleware);

// API routes via ts-rest
createExpressEndpoints(contract, router, app);

if (isProduction) {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  
  // Serve static files (JS, CSS, images)
  app.use(express.static(clientDistPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
