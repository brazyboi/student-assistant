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
import { getUserIdFromToken } from './helpers.js'; // Import your existing helpers
import { addNote } from './noteHandler.js';

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
const allowedOrigins = isProduction 
  ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(rateLimiterMiddleware);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE }
});
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, async (err) => {
      // 1. Catch Multer Errors (Size Limit, etc.)
      if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ error: "File is too large. Max limit is 10MB." });
          }
          return res.status(400).json({ error: err.message });
      } else if (err) {
          // Catch unknown errors
          return res.status(500).json({ error: "Unknown upload error." });
      }

      try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const rawText = await extractTextFromPDF(req.file.buffer);
        const chunks = chunkText(rawText);
        
        console.log(`Processing ${chunks.length} chunks for user ${userId}...`);

        let savedCount = 0;
        for (const chunk of chunks) {
            await addNote(userId, chunk);
            savedCount++;
            await new Promise(r => setTimeout(r, 100)); 
        }
        // ------------------------------

        res.json({ 
            success: true, 
            message: `Successfully processed PDF and added ${savedCount} chunks.` 
        });

    } catch (err: any) {
        console.error("Upload failed:", err);
        // Ensure we send JSON even on error
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  });
});

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
