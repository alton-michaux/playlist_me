import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRouter from './routes/health';
import authRouter from './routes/auth';
import tokenRouter from './routes/token';
import genresRouter from './routes/genres';
import playlistsRouter from './routes/playlists';
import tracksRouter from './routes/tracks';
import writeRouter from './routes/write';

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

app.use('/api', healthRouter);
app.use('/', authRouter);         // /login, /callback, /refresh
app.use('/token', tokenRouter);
app.use('/genres', genresRouter);
app.use('/playlists', playlistsRouter); // /playlists, /playlists/playlist, /playlists/tracklist
app.use('/song', tracksRouter);
app.use('/', writeRouter);        // /follow-playlist, /like-song

app.listen(PORT, () => {
  console.log(`playlist_me backend running on http://localhost:${PORT}`);
});
