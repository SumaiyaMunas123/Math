Math Classroom — Personal classroom for Grades 9–11 (Sri Lanka)

A minimal full-stack app (React + Express) to host tutorials and resources for Grade 9, 10, and 11 students.

Features
- Mobile-first, calm UI with cream/forest palette
- Pages: Homepage, Grade pages, Topic pages (Tutorials + Resources), About, Community
- Simple Admin panel to manage content (JSON editor) with token auth
- Express backend (in-memory content store; Supabase/Postgres ready)

Run locally
1. Start the backend

```bash
cd backend
node index.js
```

2. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

3. Open the app at `http://localhost:5173` and visit `/admin` to login.

Admin
- Default admin password for local dev: `admin123` (see `backend/.env` to change)
- The Admin page accepts a JSON payload of the shape `{ grades: [...], announcements: [...] }` and POSTs to `/api/content`.

Notes
- Database not configured yet; the backend uses an in-memory store. It's ready to be wired to Supabase/Postgres.
- API is proxied in development via `frontend/vite.config.js` to `http://localhost:4000`.

Files added
- `.gitignore` — ignore node_modules, env, and IDE files
- `README.md` — this file

Next steps (optional)
- Replace Admin JSON editor with a forms-based CMS
- Wire Supabase or Postgres and add migrations
- Seed the app with real past papers and YouTube playlists
