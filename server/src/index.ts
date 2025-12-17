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
import { addNote } from 'noteHandler.js';

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

const upload = multer({ storage: multer.memoryStorage() });
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const rawText = await extractTextFromPDF(req.file.buffer);
        const chunks = chunkText(rawText);
        
        console.log(`Processing ${chunks.length} chunks for user ${userId}...`);

        // --- FIX: SEQUENTIAL UPLOAD ---
        // We use a simple for-loop to wait for one to finish before starting the next.
        // It's slower, but it won't crash your server or get you banned by OpenAI.
        let savedCount = 0;
        for (const chunk of chunks) {
            await addNote(userId, chunk);
            savedCount++;
            // Optional: Add a tiny delay to be polite to OpenAI
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
