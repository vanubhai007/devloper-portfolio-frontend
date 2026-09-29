import { rateLimit } from 'express-rate-limit';

const handler = (message) => (req, res) => res.status(429).json({ success: false, message });

/** General API limit. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: handler('Too many requests. Please try again later.'),
});

/** Contact form: 5 submissions per 15 minutes per IP. */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: handler('You have sent several messages recently. Please wait a few minutes and try again.'),
});

/** Admin login: 10 attempts per 15 minutes per IP (successful logins don't count). */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: handler('Too many login attempts. Please try again in 15 minutes.'),
});
