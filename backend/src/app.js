import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { sanitize } from './middleware/sanitize.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

export const app = express();

// Render / Vercel sit behind a proxy — needed for correct client IPs in rate limiting.
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
// In development, any localhost / 127.0.0.1 port is allowed so the Vite dev
// server works however it is opened. Production only allows CLIENT_URL.
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const isAllowedOrigin = (origin) =>
  env.clientUrls.includes(origin) || (!env.isProduction && LOCAL_ORIGIN.test(origin));

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / server-to-server requests (no Origin header) and whitelisted frontends.
      if (!origin || isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(sanitize);

app.get('/', (req, res) => res.json({ success: true, message: 'Vanraj Portfolio API', health: '/api/health' }));

app.use('/api/health', healthRoutes);
app.use('/api', apiLimiter);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);
