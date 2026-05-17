Math Classroom — Personal classroom for Grades 9–11 (Sri Lanka)

A full-stack app (React + Express + dark glassy UI) to host tutorials and resources for Grade 9, 10, and 11 students in Sri Lanka.

## Features

✨ **Design**
- Dark glassy aesthetic with cream (#F5F0E8) text and forest green (#3B4F3A) accents
- Frosted glass cards with soft glowing borders
- Modern serif headings (Playfair Display) + clean sans-serif body (Inter)
- Ambient green glow in background
- Fully responsive mobile design

📚 **Content Pages**
- **Homepage** — Hero tagline, grade cards, announcements section
- **Grade Pages** (9, 10, 11) — Topic lists with clean styling
- **Topic Pages** — Two-tab interface:
  - Tutorials: Embedded YouTube videos (Sri Lanka Gov + other sources)
  - Resources: PDF links, past paper links, NIE textbook references
- **About Page** — Tutor bio with poster image and personal touch
- **Community Page** — Buttons linking to Telegram and WhatsApp communities
- **Ask a Question** — Simple form to submit questions

💬 **Community & Contact**
- Sticky "Book a Session" button (fixed bottom-right) → Direct WhatsApp message to +94777492746 with pre-filled message
- Telegram group link: https://t.me/+Tq8wM_0hnnRlNWY1
- WhatsApp community: https://chat.whatsapp.com/DxfBQaNfeu4I8FjYzO5sMq
- Ask a Question form (currently simulated; ready for EmailJS integration)

🛠️ **Backend**
- Express.js API with JWT auth (removed admin panel)
- In-memory content store (ready for Supabase/PostgreSQL)
- `/api/content` — GET all grades/topics/announcements
- `/api/content` — POST (requires admin token) — update content

## Run Locally

### Backend
```bash
cd backend
node index.js
```
Runs on `http://localhost:4000`

### Frontend (new terminal)
```bash
cd frontend
npm install  # if first time
npm run dev
```
Runs on `http://localhost:5173`

## Configuration

### WhatsApp "Book a Session" Button
- Current number: +94777492746
- Pre-filled message: "Hello! Can I please get more details about this class?"
- To change, edit `frontend/src/App.jsx` — update the `href` in the `.whatsapp-cta` link

### Announcements
- Add announcements by POSTing to `/api/content` with the backend API or manually editing `backend/index.js`
- Announcements appear on the homepage

### EmailJS Integration (Optional)
To enable actual email sending for the "Ask a Question" form:
1. Install EmailJS: `npm install @emailjs/browser` in `/frontend`
2. Sign up at https://www.emailjs.com/
3. Update `frontend/src/pages/AskQuestion.jsx`:
   - Replace `'service_id'`, `'template_id'`, `'user_key'` with your EmailJS credentials
   - Uncomment the EmailJS import

## Project Structure

```
Math/
├── backend/
│   ├── index.js          (Express server + API)
│   ├── .env              (JWT_SECRET, ADMIN_PASSWORD_HASH, PORT)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        (Home, Grade, Topic, About, Community, AskQuestion)
│   │   ├── App.jsx       (Routing shell)
│   │   ├── App.css       (Dark glassy theme)
│   │   ├── index.css     (Global styles + color vars)
│   │   └── main.jsx
│   ├── vite.config.js    (API proxy to localhost:4000)
│   └── package.json
├── .gitignore
└── README.md
```

## Colors & Theme

- **Background**: #0D0F0E (dark navy/black)
- **Accent**: #0A0C0B (darker variant for depth)
- **Text**: #E8E4DC (light cream off-white)
- **Headings**: #F5F0E8 (cream)
- **Primary**: #3B4F3A (forest green)
- **Glass effect**: Semi-transparent dark with 10-20px backdrop blur

## Next Steps

- [ ] Wire Supabase/PostgreSQL for persistent storage
- [ ] Set up EmailJS for contact form
- [ ] Seed with real Sri Lanka Gov YouTube links + NIE textbook pages
- [ ] Add user authentication for students (optional)
- [ ] Deploy to Vercel (frontend) + Railway/Render (backend)

## Admin

Admin panel has been removed for simplicity. To manage content:
1. Use the backend API: `POST /api/content` with auth token (see `backend/index.js`)
2. Or edit `backend/index.js` directly and restart the server

---

Built for Sri Lankan Grade 9–11 students. Calm, focused, simple. ✨
