import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/** Maps known error types to a clean { status, message, errors } shape. */
function normalize(err) {
  if (err.isOperational) return { status: err.statusCode, message: err.message, errors: err.errors };

  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    return { status: 400, message: 'Please correct the highlighted fields.', errors };
  }
  if (err.name === 'CastError') return { status: 400, message: 'Invalid ID or value.' };
  if (err.code === 11000) return { status: 409, message: 'A record with that value already exists.' };
  if (err.name === 'JsonWebTokenError') return { status: 401, message: 'Invalid session. Please log in again.' };
  if (err.name === 'TokenExpiredError') return { status: 401, message: 'Your session has expired. Please log in again.' };
  if (err.type === 'entity.parse.failed') return { status: 400, message: 'Malformed JSON in request body.' };
  if (err.type === 'entity.too.large') return { status: 413, message: 'Request body is too large.' };
  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
    return { status: 503, message: 'Database is temporarily unavailable. Please try again shortly.' };
  }
  if (err.message?.startsWith('CORS')) return { status: 403, message: err.message };

  return { status: 500, message: 'Something went wrong on our side. Please try again later.' };
}

// Express recognises error handlers by their 4-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const { status, message, errors } = normalize(err);
  if (status >= 500) logger.error(`${req.method} ${req.originalUrl} →`, err);

  const body = { success: false, message };
  if (errors) body.errors = errors;
  if (!env.isProduction && status >= 500) body.stack = err.stack;
  res.status(status).json(body);
}
