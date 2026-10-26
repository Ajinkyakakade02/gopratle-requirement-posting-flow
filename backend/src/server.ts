import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { connectDB } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Origins setup ────────────────────────────────────────────────────────────
// Pre-configure trusted origins, and strip any accidental trailing slashes
const defaultOrigins = [
  'http://localhost:3000',
  'https://gopratle-requirement-posting-flow.vercel.app',
];

const rawClientOrigin = process.env.CLIENT_ORIGIN || '';
const configuredOrigins = rawClientOrigin
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

// ─── Security & parsing middleware ───────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow non-browser requests (e.g. server-to-server, curl, health checks)
      if (!requestOrigin) {
        return callback(null, true);
      }

      const cleanOrigin = requestOrigin.replace(/\/+$/, '');
      let isAllowed = allowedOrigins.includes(cleanOrigin);

      if (!isAllowed) {
        try {
          const parsed = new URL(cleanOrigin);
          if (parsed.hostname.endsWith('.vercel.app')) {
            isAllowed = true;
          }
        } catch {
          isAllowed = false;
        }
      }

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn(`⚠️ Blocked by CORS: ${requestOrigin}`);
      callback(new Error(`Origin ${requestOrigin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: '1mb' }));

// ─── API routes ──────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message.includes('CORS')
        ? err.message
        : 'Internal server error.',
    });
  }
);

// ─── Start server ────────────────────────────────────────────────────────────
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 GoPratle API running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

start();
