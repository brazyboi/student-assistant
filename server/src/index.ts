import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';
import { createExpressEndpoints } from '@ts-rest/express';
import { contract } from '@student-assistant/shared';
import { rateLimiterMiddleware } from './redisRateLimiter.js';
import multer from 'multer';
import { extractTextFromPDF, chunkText } from './pdfUtils.js';
import { getUserIdFromToken } from './helpers.js';
import { addNote } from './noteHandler.js';
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}
// dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// const allowedOrigins = isProduction 
//   ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim())
//   : ['http://localhost:5173', 'http://localhost:3000'];
const allowedOrigins = isProduction 
  ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // !origin allows for non-browser requests (like curl or postman)
    // In production, if frontend and backend are on same domain, origin might be undefined or match
    if (!origin || allowedOrigins.includes(origin) || isProduction) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(rateLimiterMiddleware);

// Upload PDF route
const MAX_SIZE = 10 * 1024 * 1024;
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE }
});

app.post('/api/upload-pdf', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromToken(req.headers.authorization);
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const rawText = await extractTextFromPDF(req.file.buffer);
    const chunks = chunkText(rawText);
    
    console.log(`Processing ${chunks.length} chunks for user ${userId}...`);

    let savedCount = 0;
    for (const chunk of chunks) {
      await addNote(userId, chunk);
      savedCount++;
      await new Promise(r => setTimeout(r, 100)); 
    }

    res.json({ 
      success: true, 
      message: `Successfully processed PDF and added ${savedCount} chunks.` 
    });

  } catch (err: any) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Other API routes via ts-rest
createExpressEndpoints(contract, router, app);

if (isProduction) {
  // Use process.cwd() to ensure we are at the /app root in Docker
  const clientDistPath = path.join(process.cwd(), 'client', 'dist');
  
  console.log(`[Production] Serving static files from: ${clientDistPath}`);

  app.use(express.static(clientDistPath));
  
  app.get('*', (req, res) => {
    const indexPath = path.join(clientDistPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[Error] 404 on SPA Fallback. Looked at: ${indexPath}`);
        res.status(404).send("Frontend assets not found. Check Docker build.");
      }
    });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});