/*
 * Creates the admin account (or resets its password) from ADMIN_EMAIL / ADMIN_PASSWORD.
 * Usage: npm run seed:admin
 */
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';

if (!email || password.length < 10) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (min 10 characters) in backend/.env first.');
  process.exit(1);
}

try {
  await mongoose.connect(env.mongoUri);
  let admin = await Admin.findOne({ email }).select('+password');
  if (admin) {
    admin.password = password;
    await admin.save();
    console.info(`Admin password updated for ${email}`);
  } else {
    admin = await Admin.create({ email, password });
    console.info(`Admin created: ${email}`);
  }
  console.info('Done. You can now remove ADMIN_PASSWORD from your .env file.');
} catch (err) {
  console.error('Seeding admin failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
