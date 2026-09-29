import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';

/** Requires a valid "Authorization: Bearer <jwt>" header for an existing admin. */
export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required.', 401));
  }

  const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  const admin = await Admin.findById(payload.sub);
  if (!admin) return next(new AppError('Account no longer exists.', 401));

  // Invalidate tokens issued before the last password change.
  if (admin.passwordChangedAt && payload.iat * 1000 < admin.passwordChangedAt.getTime() - 1000) {
    return next(new AppError('Password changed recently. Please log in again.', 401));
  }

  req.admin = admin;
  next();
}
