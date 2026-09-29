import mongoose from 'mongoose';

const urlField = {
  type: String,
  trim: true,
  default: '',
  validate: {
    validator: (v) => !v || /^https?:\/\//i.test(v),
    message: 'URL must start with http:// or https://',
  },
};

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, trim: true, default: '' },
    cover: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    tech: { type: [String], default: [] },
    features: { type: [String], default: [] },
    liveUrl: urlField,
    repoUrl: urlField,
    backendRepoUrl: urlField,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const Project = mongoose.model('Project', projectSchema);
