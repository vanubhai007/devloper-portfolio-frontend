/*
 * Upserts portfolio projects into MongoDB so they can be served from /api/projects.
 * The frontend falls back to siteConfig.js if the collection is empty.
 * Usage: npm run seed:projects
 */
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Project } from '../models/Project.js';

const GITHUB = 'https://github.com/vanubhai007';

const projects = [
  {
    slug: 'uvi-hotel-booking',
    name: 'UVI Hotel Booking',
    category: 'Full Stack Web App',
    cover: 'hotel',
    summary:
      'A full stack hotel booking platform with room browsing, bookings, guest details and an admin dashboard to manage reservations.',
    description:
      'UVI Hotel Booking lets guests browse rooms, view room details and book a stay with check-in / check-out dates and guest information. Administrators get a dashboard to manage bookings and update booking status. The React frontend talks to a Node.js + Express REST API backed by MongoDB.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    features: [
      'Hotel room browsing',
      'Room details',
      'Booking system',
      'Check-in / Check-out',
      'Guest information',
      'Booking management',
      'Admin dashboard',
      'Booking status',
      'Contact system',
    ],
    liveUrl: 'https://uvi-hotel-frontend.vercel.app/',
    repoUrl: `${GITHUB}/uvi-hotel-frontend`,
    backendRepoUrl: `${GITHUB}/uvi-hotel-backend`,
    featured: true,
    order: 1,
  },
  {
    slug: 'uvi-groups-construction',
    name: 'UVI Groups Construction',
    category: 'Business Website',
    cover: 'construction',
    summary: 'A professional website for a construction company presenting its services, completed projects and contact details.',
    description:
      'A responsive business website for a construction company. It introduces the company, lists its services, showcases projects and gives visitors a clear way to get in touch.',
    tech: ['React.js', 'JavaScript', 'CSS'],
    features: ['Company introduction', 'Services', 'Projects', 'About', 'Contact', 'Responsive design'],
    repoUrl: `${GITHUB}/uvi-groups-construction`,
    order: 2,
  },
  {
    slug: 'uvi-shield-security',
    name: 'UVI Shield Security',
    category: 'Business Website',
    cover: 'security',
    summary: 'A professional website for a security services company with service listings, company information and contact.',
    description:
      'A responsive website for a security company, presenting its security services and company information with a clean, professional UI and a contact section for enquiries.',
    tech: ['React.js', 'JavaScript', 'CSS'],
    features: ['Security services', 'Company information', 'Services', 'Contact', 'Responsive design', 'Professional UI'],
    repoUrl: `${GITHUB}/uvi-shield-security`,
    order: 3,
  },
];

try {
  await mongoose.connect(env.mongoUri);
  for (const project of projects) {
    await Project.findOneAndUpdate({ slug: project.slug }, project, { upsert: true, runValidators: true });
  }
  console.info(`Seeded ${projects.length} projects.`);
} catch (err) {
  console.error('Seeding projects failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
