import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'], trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please provide a valid email address.'],
    },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    subject: { type: String, required: [true, 'Subject is required.'], trim: true, minlength: 3, maxlength: 150 },
    message: { type: String, required: [true, 'Message is required.'], trim: true, minlength: 10, maxlength: 3000 },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model('Contact', contactSchema);
