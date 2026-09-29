/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to update the portfolio.
 * ─────────────────────────────────────────────────────────────
 * Everything personal (name, links, education, projects …) lives here so
 * you never need to touch component code to change your information.
 *
 * Values marked `TODO` are placeholders — replace them with your real data.
 */

// GitHub account that hosts the project repositories.
const GITHUB_USERNAME = 'vanubhai007';
const github = (repo) => `https://github.com/${GITHUB_USERNAME}/${repo}`;

export const siteConfig = {
  name: 'Sankhat Vanrajbhai Mangalbhai',
  shortName: 'Vanraj',
  role: 'Full Stack Developer',
  tagline: 'I build modern, scalable and interactive web experiences.',
  typingWords: ['Full Stack Developer', 'React Developer', 'Node.js & Express APIs', 'MongoDB Integrations'],
  location: 'Surat, Gujarat, India',
  languages: ['Gujarati', 'Hindi', 'English'],
  email: 'your.email@example.com', // TODO
  phone: '+91 00000 00000', // TODO
  availability: 'Open to full-time roles & freelance projects',
  siteUrl: 'https://your-portfolio.vercel.app', // TODO: your deployed URL

  // Put your PDF at frontend/public/resume/Vanraj-Resume.pdf (same name) to replace it.
  resumeUrl: '/resume/Vanraj-Resume.pdf',
  resumeFileName: 'Vanraj-Resume.pdf',

  socialLinks: {
    github: `https://github.com/${GITHUB_USERNAME}`,
    linkedin: 'https://www.linkedin.com/in/your-profile', // TODO
    instagram: 'https://www.instagram.com/your-handle', // TODO
    email: 'mailto:your.email@example.com', // TODO
    whatsapp: 'https://wa.me/910000000000', // TODO: country code + number, digits only
  },

  githubUsername: GITHUB_USERNAME,

  about: {
    intro:
      'I am a Full Stack Developer from Surat, Gujarat, focused on building modern, responsive and scalable web applications.',
    body: [
      'I work across the stack — building interfaces with React and JavaScript, writing REST APIs with Node.js and Express, and modelling data in MongoDB and MySQL. I use Git and GitHub for every project and deploy frontends to Vercel and APIs to Render.',
      'Before moving into development I worked in store management, which taught me how real businesses run: handling customers, stock and day-to-day operations. I bring that practical mindset to the software I build — clear, reliable and useful for the people who use it.',
    ],
    highlights: [
      { label: 'Real-world projects', value: '3+' },
      { label: 'Certification grade', value: 'A+' },
      { label: 'Languages spoken', value: '3' },
    ],
  },

  /*
   * Skill levels are honest self-descriptions, NOT measured percentages.
   *   'production' → used in deployed projects
   *   'comfortable' → used regularly, confident
   *   'learning'   → actively improving
   */
  skillLevels: {
    production: { label: 'Used in deployed projects', dots: 3 },
    comfortable: { label: 'Comfortable', dots: 2 },
    learning: { label: 'Actively learning', dots: 1 },
  },
  skills: [
    {
      category: 'Frontend',
      accent: 'var(--primary)',
      items: [
        { name: 'HTML5', icon: 'html', level: 'production' },
        { name: 'CSS3', icon: 'css', level: 'production' },
        { name: 'JavaScript', icon: 'js', level: 'production' },
        { name: 'React.js', icon: 'react', level: 'production' },
        { name: 'Vite', icon: 'vite', level: 'production' },
        { name: 'Responsive Design', icon: 'responsive', level: 'production' },
      ],
    },
    {
      category: 'Backend',
      accent: 'var(--secondary)',
      items: [
        { name: 'Node.js', icon: 'node', level: 'production' },
        { name: 'Express.js', icon: 'express', level: 'production' },
        { name: 'REST API', icon: 'api', level: 'production' },
      ],
    },
    {
      category: 'Database',
      accent: 'var(--accent)',
      items: [
        { name: 'MongoDB', icon: 'mongodb', level: 'production' },
        { name: 'MongoDB Atlas', icon: 'mongodb', level: 'production' },
        { name: 'MySQL', icon: 'mysql', level: 'comfortable' },
      ],
    },
    {
      category: 'Tools & Deployment',
      accent: 'var(--primary)',
      items: [
        { name: 'Git', icon: 'git', level: 'production' },
        { name: 'GitHub', icon: 'github', level: 'production' },
        { name: 'VS Code', icon: 'vscode', level: 'production' },
        { name: 'Vercel', icon: 'vercel', level: 'production' },
        { name: 'Render', icon: 'render', level: 'comfortable' },
      ],
    },
  ],

  experience: [
    {
      title: 'Full Stack Developer Intern',
      organization: '', // TODO: add company name if you want it shown
      period: '2025 – Present',
      type: 'Internship',
      points: [
        'Developing responsive web applications',
        'Building React interfaces',
        'Developing backend APIs with Node.js & Express',
        'Working with databases (MongoDB, MySQL)',
        'Debugging and fixing issues',
        'Git / GitHub workflow',
        'Deploying applications',
      ],
    },
    {
      title: 'Store Management',
      organization: '', // TODO: add store name if you want it shown
      period: '', // TODO: add dates if you want them shown
      type: 'Business operations',
      points: [
        'Hands-on experience running day-to-day store operations',
        'Worked directly with customers and business processes',
      ],
    },
  ],

  education: [
    { title: 'Full Stack Development Certification', org: '', year: '2025', result: 'A+ Grade', highlight: true },
    { title: 'CCC (Course on Computer Concepts)', org: 'Vishwa Computer Education', year: '', result: 'A Grade' },
    { title: 'B.Com', org: 'MKBU', year: '', result: '58%' },
    { title: '12th (HSC)', org: 'GSHEB', year: '', result: '62.28%' },
    { title: '10th (SSC)', org: 'GSEB', year: '', result: '61.50%' },
  ],

  services: [
    { title: 'Website Development', icon: 'web', text: 'Fast, modern websites built with clean, maintainable code.' },
    { title: 'Full Stack Development', icon: 'stack', text: 'End-to-end apps: React frontend, Express API and MongoDB database.' },
    { title: 'React Development', icon: 'react', text: 'Component-driven, interactive user interfaces with React.' },
    { title: 'Backend API Development', icon: 'api', text: 'Secure REST APIs with validation, auth and error handling.' },
    { title: 'MongoDB Integration', icon: 'db', text: 'Data models, queries and Atlas cloud database setup.' },
    { title: 'Responsive Websites', icon: 'responsive', text: 'Layouts that work from 320px phones to wide desktops.' },
    { title: 'Business Websites', icon: 'business', text: 'Professional sites for shops, services and local businesses.' },
    { title: 'Website Maintenance', icon: 'maintenance', text: 'Updates, bug fixes and improvements for existing websites.' },
  ],

  /*
   * Projects. `cover` is the key of an SVG cover in src/assets/projects.
   * To use a real screenshot instead, set `image: '/images/your-file.webp'`
   * (put the file in frontend/public/images).
   */
  projects: [
    {
      slug: 'uvi-hotel-booking',
      name: 'UVI Hotel Booking',
      category: 'Full Stack Web App',
      cover: 'hotel',
      image: '',
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
      repoUrl: github('uvi-hotel-frontend'),
      backendRepoUrl: github('uvi-hotel-backend'),
      featured: true,
    },
    {
      slug: 'uvi-groups-construction',
      name: 'UVI Groups Construction',
      category: 'Business Website',
      cover: 'construction',
      image: '',
      summary:
        'A professional website for a construction company presenting its services, completed projects and contact details.',
      description:
        'A responsive business website for a construction company. It introduces the company, lists its services, showcases projects and gives visitors a clear way to get in touch — designed to build trust with potential clients.',
      tech: ['React.js', 'JavaScript', 'CSS'],
      features: ['Company introduction', 'Services', 'Projects', 'About', 'Contact', 'Responsive design'],
      liveUrl: '', // TODO: add deployed URL
      repoUrl: github('uvi-groups-construction'),
      featured: false,
    },
    {
      slug: 'uvi-shield-security',
      name: 'UVI Shield Security',
      category: 'Business Website',
      cover: 'security',
      image: '',
      summary:
        'A professional website for a security services company with service listings, company information and contact.',
      description:
        'A responsive website for a security company, presenting its security services and company information with a clean, professional UI and a contact section for enquiries.',
      tech: ['React.js', 'JavaScript', 'CSS'],
      features: ['Security services', 'Company information', 'Services', 'Contact', 'Responsive design', 'Professional UI'],
      liveUrl: '', // TODO: add deployed URL
      repoUrl: github('uvi-shield-security'),
      featured: false,
    },
  ],

  navLinks: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ],
};

export default siteConfig;
