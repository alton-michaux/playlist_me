import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// WSL2: browser may arrive from either localhost:3000 or 127.0.0.1:3000
const allowedOrigins = [
  process.env.FRONTEND_URL ?? 'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes (wired in Phase 2)
app.get('/api', (_req, res) => {
  res.json({ status: 'ok', service: 'playlist_me-backend' });
});

app.listen(PORT, () => {
  console.log(`playlist_me backend running on http://localhost:${PORT}`);
});
