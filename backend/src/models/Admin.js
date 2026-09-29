import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const SALT_ROUNDS = 12;

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 10, select: false },
    passwordChangedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

// Hash the password whenever it is set or changed — plaintext is never stored.
adminSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  if (!this.isNew) this.passwordChangedAt = new Date();
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.methods.toSafeJSON = function toSafeJSON() {
  return { id: this._id, email: this.email, lastLoginAt: this.lastLoginAt };
};

export const Admin = mongoose.model('Admin', adminSchema);
