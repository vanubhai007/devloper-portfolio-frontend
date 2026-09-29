import { isDbConnected } from '../config/db.js';

/** GET /api/health — used by Render health checks and uptime monitors. */
export function health(req, res) {
  const db = isDbConnected();
  res.status(db ? 200 : 503).json({
    success: db,
    status: db ? 'ok' : 'degraded',
    database: db ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
