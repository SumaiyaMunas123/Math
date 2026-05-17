const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$Vbq3N1ZxgFqvG1qfQz1eO.2e5kQq2Z8k2b1Qy9mY4rN6Yb1w8K6uK'; // "admin123" hashed
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

let data = {
  grades: [
    { id: '9', title: 'Grade 9', topics: [] },
    { id: '10', title: 'Grade 10', topics: [] },
    { id: '11', title: 'Grade 11', topics: [] },
  ],
  announcements: []
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Missing password' });
  const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.get('/api/content', (req, res) => {
  res.json(data);
});

app.post('/api/content', authenticateToken, (req, res) => {
  const { grades, announcements } = req.body;
  data = { grades: grades || data.grades, announcements: announcements || data.announcements };
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
