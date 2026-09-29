# Vanraj — Full Stack Developer Portfolio

A 3D developer portfolio with a working contact system and an admin dashboard.

- **Frontend:** React 19 + Vite, React Three Fiber / drei (3D), Framer Motion, plain CSS Modules
- **Backend:** Node.js + Express 5, MongoDB (Mongoose), Nodemailer, JWT + bcrypt
- **Deploy:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

```
.
├── frontend/                 React app (Vercel)
│   ├── public/               robots.txt, sitemap.xml, og-image.png, resume/Vanraj-Resume.pdf
│   └── src/
│       ├── config/siteConfig.js   ← ALL personal info, links, projects
│       ├── styles/                theme tokens (variables.css), global styles
│       ├── components/            Navbar, Footer, cards, cursor, modal, admin widgets
│       ├── sections/              Hero, About, Skills, Experience, Education, Services,
│       │                          Projects, TechStack3D, GitHubSection, Resume, Contact
│       ├── three/                 HeroScene, FloatingObjects, Particles, TechnologyScene, fallback
│       ├── pages/                 HomePage, AdminLogin, AdminDashboard, NotFound
│       ├── hooks/ services/ utils/
│       └── assets/projects/       SVG project covers
└── backend/                  Express API (Render)
    └── src/
        ├── config/ (env, db)  models/ (Contact, Project, Admin)
        ├── controllers/  routes/  middleware/  utils/  scripts/
        ├── app.js
        └── server.js
```

---

## 1. Personalise the site

Almost everything lives in **`frontend/src/config/siteConfig.js`**: name, role, email, phone, social links, about text, skills, experience, education, services and projects. Values marked `// TODO` are placeholders. Replace them with your real details.

| What | Where |
| --- | --- |
| Resume | Replace `frontend/public/resume/Vanraj-Resume.pdf` (keep the file name, or change `resumeUrl` in siteConfig). The included PDF is a sample generated from the portfolio data. |
| Theme colours | `frontend/src/styles/variables.css` (`--bg`, `--surface`, `--primary`, `--secondary`, `--text`, `--muted`, `--border` …) |
| Project screenshots | Put an image in `frontend/public/images/` and set `image: '/images/your-file.webp'` on the project |
| Domain for SEO | Replace `https://your-portfolio.vercel.app` in `frontend/index.html`, `public/robots.txt` and `public/sitemap.xml` |

**Skill indicators** use honest labels ("Used in deployed projects", "Comfortable", "Actively learning"), not made-up percentages. You change them per skill with the `level` field.

---

## 2. Local development

**Requirements:** Node.js 20+, and MongoDB (a local install, Docker, or a free Atlas cluster).

### Backend

```bash
cd backend
npm install
cp .env.example .env          # then fill in the values (see below)
npm run seed:admin            # creates your admin login from ADMIN_EMAIL / ADMIN_PASSWORD
npm run seed:projects         # optional: store projects in MongoDB
npm run dev                   # http://localhost:5000
```

MongoDB via Docker (optional): `docker run -d -p 27017:27017 --name mongo mongo:7`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:5000
npm run dev                   # http://localhost:5173
```

- Portfolio: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin/login`

### Production build

```bash
cd frontend && npm run build && npm run preview   # outputs to frontend/dist
cd backend && npm start
```

---

## 3. Environment variables

### Frontend: `frontend/.env`

| Variable | Example | Notes |
| --- | --- | --- |
| `VITE_API_URL` | `https://vanraj-api.onrender.com` | Backend base URL, without `/api` or a trailing slash. **Never put secrets here**: every `VITE_` variable is public. |

### Backend: `backend/.env`

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | no | Defaults to `5000` (Render sets it automatically) |
| `NODE_ENV` | no | `production` on Render (hides error stack traces) |
| `MONGO_URI` | **yes** | Local or Atlas connection string |
| `JWT_SECRET` | **yes** | At least 32 random characters: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | no | Admin session length, default `8h` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | for seeding | Used only by `npm run seed:admin`. The password is stored as a bcrypt hash; remove it from `.env` afterwards. Run the seed again to change the password (this logs out existing sessions). |
| `EMAIL_USER` | for email | Gmail address that sends mail |
| `EMAIL_PASSWORD` | for email | **Gmail App Password**, not your normal password (Google Account → Security → 2-Step Verification → App passwords) |
| `OWNER_EMAIL` | for email | Where new-message notifications go |
| `EMAIL_HOST` / `EMAIL_PORT` | no | Custom SMTP server. Leave empty to use Gmail. |
| `SEND_ACK_EMAIL` | no | `true` sends visitors an automatic "thanks, I got your message" email |
| `CLIENT_URL` | **yes (prod)** | Frontend origin(s) allowed by CORS, comma-separated, no trailing slash |

If email isn't configured, messages are still saved to MongoDB and appear in the admin dashboard. They just aren't emailed.

---

## 4. API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | – | Health and database status (use it as Render's health check) |
| POST | `/api/contact` | – | Save a contact message and send emails. Rate-limited to 5 per 15 min per IP. |
| GET | `/api/projects` | – | Published projects. An empty list means the frontend uses `siteConfig`. |
| POST | `/api/admin/login` | – | `{ email, password }` → `{ token, admin }`. Rate-limited. |
| GET | `/api/admin/me` | JWT | Current admin |
| GET | `/api/admin/stats` | JWT | Total, unread, today, last 7 days |
| GET | `/api/admin/messages?page=&limit=&status=all\|read\|unread&search=` | JWT | Paginated, searchable messages |
| GET | `/api/admin/messages/:id` | JWT | One message |
| PATCH | `/api/admin/messages/:id/read` | JWT | `{ isRead: boolean }` |
| DELETE | `/api/admin/messages/:id` | JWT | Delete a message |

Send the JWT as `Authorization: Bearer <token>`.

**Security measures:**
- Helmet security headers and a CORS allow-list
- Rate limits: 300 req / 15 min globally, plus stricter limits on contact and login
- 10 KB JSON body limit
- Whitelisted, validated inputs; MongoDB operator keys (`$…`, `.`) stripped from request bodies
- Honeypot field against spam bots
- bcrypt (12 rounds) password hashing
- Login responses take the same time for unknown emails and wrong passwords
- Sessions invalidated after a password change
- HTML-escaped email templates
- Central error handling (validation, cast, duplicate, JWT, database, 404)

---

## 5. Deployment

### Step 1: MongoDB Atlas (database)

1. Create a free **M0** cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → add a database user with a strong password and the *Read and write to any database* role.
3. **Network Access** → *Add IP Address*. Render's free tier has no static outbound IPs, so allow `0.0.0.0/0`. The database is still protected by the username and password. On a paid Render plan with static IPs, allow only those.
4. **Connect → Drivers** → copy the connection string, fill in the user and password, and add a database name:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`
   URL-encode special characters in the password (for example, `@` becomes `%40`).

### Step 2: Render (backend)

1. Push this repo to GitHub.
2. Render → **New → Web Service** → connect the repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
4. **Environment:** add `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`, `OWNER_EMAIL`, `SEND_ACK_EMAIL`, and `CLIENT_URL` (set a placeholder for now and update it after Step 3). Don't set `PORT`; Render provides it.
5. Deploy, then open `https://<your-service>.onrender.com/api/health` and check it reports `"database":"connected"`.
6. Create your admin account. The simplest way is to run the seed from your own computer against Atlas: put the Atlas `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run `npm run seed:admin`. On paid Render instances you can run the same command in the **Shell** tab instead.

> Render's free services sleep after inactivity, so the first request can take around 30–50 s. The frontend shows a loading state and a retry option.

### Step 3: Vercel (frontend)

1. Vercel → **Add New → Project** → import the repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables:** `VITE_API_URL=https://<your-service>.onrender.com`
4. Deploy. `frontend/vercel.json` already rewrites routes like `/admin/login` to the SPA and sets caching and security headers.

### Step 4: Connect them

1. Copy your Vercel URL (for example, `https://vanraj-portfolio.vercel.app`).
2. On Render, set `CLIENT_URL=https://vanraj-portfolio.vercel.app`. Add more origins separated by commas, such as a custom domain. Render redeploys automatically.
3. Send a test message through the contact form, then check your inbox and `/admin/dashboard`.
4. Update the site URL in `index.html`, `robots.txt` and `sitemap.xml`, then redeploy.

**If the contact form fails in production:**
- A CORS error in the browser console means `CLIENT_URL` doesn't exactly match the Vercel origin (protocol included, no trailing slash).
- A network error means `VITE_API_URL` is wrong, or you changed it without redeploying. Vite bakes it in at build time.
- If the health check says `disconnected`, check the Atlas network access list and the `MONGO_URI` credentials.

---

## 6. Performance and accessibility

**Performance:**
- Three.js and the 3D scenes are loaded lazily, in their own chunk.
- The technology sphere only mounts near the viewport, and both scenes pause rendering when off-screen.
- On mobile the 3D uses less geometry, fewer particles, a capped pixel ratio and no pointer parallax.
- WebGL is detected before loading 3D. Devices without WebGL, low-power devices and visitors with `prefers-reduced-motion` get a CSS fallback.
- Admin pages are code-split, and images are lazy-loaded.

**Accessibility:**
- Semantic landmarks and a skip link
- Labelled form fields with inline, announced errors
- Visible focus states
- A focus-trapped project dialog that closes with Esc
- All animations respect reduced-motion settings
- The custom cursor only appears on fine-pointer devices
