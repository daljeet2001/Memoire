import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import spaceRoutes from './routes/space.js';
import entryRoutes from './routes/entries.js';
import uploadRoutes from './routes/uploads.js';
import rateLimit from 'express-rate-limit';

const app = express();
await connectDB();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/uploads', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err?.message || 'Bad Request' });
});

app.listen(env.port, () => console.log(`✓ API on :${env.port}`));

