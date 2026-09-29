import { Project } from '../models/Project.js';

/** GET /api/projects — published projects, ordered. */
export async function listProjects(req, res) {
  const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
  res.json({ success: true, count: projects.length, data: projects });
}
