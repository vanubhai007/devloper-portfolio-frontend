import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { Contact } from '../models/Contact.js';
import { AppError } from '../utils/AppError.js';
import { escapeRegex } from '../utils/validators.js';

// Hash compared against when the email doesn't exist, so response time is the
// same for unknown emails and wrong passwords (prevents user enumeration).
const DUMMY_HASH = bcrypt.hashSync('timing-safe-placeholder', 12);

const signToken = (admin) =>
  jwt.sign({ sub: admin._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn, algorithm: 'HS256' });

/** POST /api/admin/login */
export async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');

  const valid = admin ? await admin.comparePassword(password) : await bcrypt.compare(password, DUMMY_HASH);
  if (!admin || !valid) throw new AppError('Invalid email or password.', 401);

  admin.lastLoginAt = new Date();
  await admin.save({ validateModifiedOnly: true });

  res.json({ success: true, data: { token: signToken(admin), admin: admin.toSafeJSON() } });
}

/** GET /api/admin/me */
export function me(req, res) {
  res.json({ success: true, data: req.admin.toSafeJSON() });
}

/** GET /api/admin/stats */
export async function stats(req, res) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, unread, today, lastWeek] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
    Contact.countDocuments({ createdAt: { $gte: startOfToday } }),
    Contact.countDocuments({ createdAt: { $gte: weekAgo } }),
  ]);
  res.json({ success: true, data: { total, unread, today, lastWeek } });
}

/** GET /api/admin/messages?page=&limit=&status=all|read|unread&search= */
export async function listMessages(req, res) {
  const q = req.query;
  const page = Math.max(1, Number.parseInt(String(q.page ?? '1'), 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(String(q.limit ?? '10'), 10) || 10));
  const status = String(q.status ?? 'all');
  const search = String(q.search ?? '').trim().slice(0, 100);

  const filter = {};
  if (status === 'read') filter.isRead = true;
  if (status === 'unread') filter.isRead = false;
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { subject: rx }, { message: rx }];
  }

  const [items, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  });
}

/** GET /api/admin/messages/:id */
export async function getMessage(req, res) {
  const message = await Contact.findById(req.params.id).lean();
  if (!message) throw new AppError('Message not found.', 404);
  res.json({ success: true, data: message });
}

/** PATCH /api/admin/messages/:id/read  { isRead: boolean } */
export async function setReadStatus(req, res) {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  if (!message) throw new AppError('Message not found.', 404);
  res.json({ success: true, data: message });
}

/** DELETE /api/admin/messages/:id */
export async function deleteMessage(req, res) {
  const message = await Contact.findByIdAndDelete(req.params.id);
  if (!message) throw new AppError('Message not found.', 404);
  res.json({ success: true, message: 'Message deleted.' });
}
