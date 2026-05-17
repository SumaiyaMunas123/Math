const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$Vbq3N1ZxgFqvG1qfQz1eO.2e5kQq2Z8k2b1Qy9mY4rN6Yb1w8K6uK'; // "admin123" hashed
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

const TERM_UNITS = {
  '9': {
    'Term 1': [
      'Sets',
      'Real Numbers',
      'Algebraic Expressions',
      'Factors and Multiples',
      'Fractions',
      'Ratio and Proportion',
      'Percentage',
      'Profit, Loss and Discount'
    ],
    'Term 2': [
      'Linear Equations',
      'Graphs',
      'Geometry Basics',
      'Angles',
      'Triangles',
      'Congruency',
      'Perimeter and Area',
      'Symmetry'
    ],
    'Term 3': [
      'Statistics',
      'Probability Basics',
      'Mensuration',
      'Volume',
      'Transformations',
      'Scale Drawings',
      'Speed, Time and Distance',
      'Simple Interest'
    ]
  },
  '10': {
    'Term 1': [
      'Surds',
      'Indices',
      'Algebraic Manipulation',
      'Factorization',
      'Quadratic Expressions',
      'Simultaneous Equations',
      'Linear Graphs',
      'Functions'
    ],
    'Term 2': [
      'Geometry',
      'Circle Theorems',
      'Similarity',
      'Trigonometry Basics',
      'Mensuration',
      'Surface Area and Volume',
      'Coordinate Geometry',
      'Loci and Constructions'
    ],
    'Term 3': [
      'Statistics',
      'Probability',
      'Variations',
      'Financial Mathematics',
      'Bearings',
      'Transformations',
      'Matrices',
      'Mathematical Reasoning'
    ]
  },
  '11': {
    'Term 1': [
      'Quadratic Equations',
      'Algebraic Fractions',
      'Functions',
      'Inequalities',
      'Graphs',
      'Sets',
      'Logarithms',
      'Sequences'
    ],
    'Term 2': [
      'Trigonometry',
      'Geometry and Riders',
      'Circle Geometry',
      'Coordinate Geometry',
      'Mensuration',
      'Vectors',
      'Constructions and Loci'
    ],
    'Term 3': [
      'Statistics',
      'Probability',
      'Linear Programming Basics',
      'Transformations',
      'Financial Mathematics',
      'Speed and Distance Problems',
      'Revision and Past Papers',
      'Problem Solving'
    ]
  }
};

const BASE_RESOURCES = [
  { id: 'nie', title: 'National Institute of Education (NIE)', url: 'https://nie.lk', type: 'theory' },
  { id: 'ethaksalawa-home', title: 'e-Thaksalawa Home (MOE)', url: 'https://e-thaksalawa.moe.gov.lk/', type: 'theory' },
  { id: 'question-papers', title: 'e-Thaksalawa Question Papers', url: 'https://e-thaksalawa.moe.gov.lk/En/en-QuestionPapers.php', type: 'papers' },
  { id: 'govdoc-maths-past', title: 'GovDoc Mathematics Past Papers', url: 'https://govdoc.lk/subjects/mathematics/past-papers', type: 'papers' },
  { id: 'pastpapers-wiki-ol', title: 'Past Papers Wiki - O/L Mathematics', url: 'https://pastpapers.wiki/category/o-l-mathematics/', type: 'papers' },
  { id: 'pastpapers-medium', title: 'Past Papers Wiki - Medium Selection (O/L Maths)', url: 'https://pastpapers.wiki/select-your-medium-o-l-maths/', type: 'papers' },
  { id: 'mathematics-lk-term', title: 'O/L Past & Term Test Papers Download', url: 'https://www.mathematics.lk/o-l-past-papers-and-term-test-papers-for-download/', type: 'papers' }
];

const GRADE_RESOURCE_LINKS = {
  '9': [
    { id: 'g9-ethaksalawa', title: 'Grade 9 Mathematics - e-Thaksalawa', url: 'https://e-thaksalawa.moe.gov.lk/En/en-grade9.php' },
    { id: 'g9-syllabus', title: 'Grade 9 Mathematics Syllabus', url: 'https://govdoc.lk/category/syllabus/grade-9/mathematics' },
    { id: 'g9-textbook', title: 'Grade 9 Maths Textbook PDFs (English Medium)', url: 'https://www.paperslanka.com/2022/02/grade-9-mathematics-textbooks-english-medium-new-syllabus-pdf-free-download.html', type: 'theory' },
    { id: 'g9-hub', title: 'Grade 9 Resources Hub', url: 'https://govdoc.lk/grades/grade-9/syllabus', type: 'theory' },
    { id: 'g9-question-section', title: 'Grade 9 Maths Past Question Papers (e-Thaksalawa)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/section.php?id=13314', type: 'papers' }
  ],
  '10': [
    { id: 'g10-ethaksalawa', title: 'Grade 10 Mathematics - e-Thaksalawa', url: 'https://www.e-thaksalawa.moe.gov.lk/En/en-grade10.php' },
    { id: 'g10-syllabus', title: 'Grade 10 Mathematics Syllabus', url: 'https://govdoc.lk/category/syllabus/grade-10/mathematics' },
    { id: 'g10-course', title: 'Grade 10 Maths Course Page (Lessons + Papers)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/view.php?id=842', type: 'theory' },
    { id: 'g10-papers', title: 'Grade 10 Maths Papers and Resources', url: 'https://govdoc.lk/subjects/mathematics/grade-10', type: 'papers' },
    { id: 'g10-question-section', title: 'Grade 10 Maths Papers (e-Thaksalawa)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/section.php?id=13258', type: 'papers' }
  ],
  '11': [
    { id: 'g11-ethaksalawa', title: 'Grade 11 Mathematics - e-Thaksalawa', url: 'https://www.e-thaksalawa.moe.gov.lk/En/en-grade11.php' },
    { id: 'g11-syllabus', title: 'Grade 11 Mathematics Syllabus', url: 'https://govdoc.lk/category/syllabus/grade-11/mathematics' },
    { id: 'g11-course', title: 'Grade 11 Maths Course Page (Lessons + Papers)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/view.php?id=799&lang=en', type: 'theory' },
    { id: 'g11-papers', title: 'Grade 11 Maths Papers and Resources', url: 'https://govdoc.lk/subjects/mathematics/grade-11', type: 'papers' },
    { id: 'g11-hub', title: 'Grade 11 Resources Hub', url: 'https://govdoc.lk/grades/grade-11/syllabus', type: 'theory' }
  ]
};

const GRADE_QUESTION_LINKS = {
  '9': [
    { id: 'q-g9-et', title: 'Grade 9 Term Test Papers with Answers (e-Thaksalawa)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/section.php?id=13314' },
    { id: 'q-govdoc-term', title: 'GovDoc Mathematics Term Papers', url: 'https://govdoc.lk/category/term-test-papers/mathematics' },
    { id: 'q-examresults', title: 'ExamResults.lk Term Papers with Marking', url: 'https://www.examresults.lk/' }
  ],
  '10': [
    { id: 'q-g10-et', title: 'Grade 10 Maths Papers (e-Thaksalawa)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/section.php?id=13258' },
    { id: 'q-govdoc-term', title: 'GovDoc Mathematics Term Papers', url: 'https://govdoc.lk/category/term-test-papers/mathematics' },
    { id: 'q-pastpapers-answers', title: 'GCE O/L Mathematics Past Papers with Answers', url: 'https://pastpapers.wiki/gce-o-l-mathematics-past-papers-with-answers/' }
  ],
  '11': [
    { id: 'q-g11-course', title: 'Grade 11 Maths Course Papers (e-Thaksalawa)', url: 'https://e-thaksalawa.moe.gov.lk/lcms/course/view.php?id=799&lang=en' },
    { id: 'q-govdoc-term', title: 'GovDoc Mathematics Term Papers', url: 'https://govdoc.lk/category/term-test-papers/mathematics' },
    { id: 'q-pastpapers-answers', title: 'GCE O/L Mathematics Past Papers with Answers', url: 'https://pastpapers.wiki/gce-o-l-mathematics-past-papers-with-answers/' }
  ]
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function uniqueByUrl(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}

function buildTutorials(gradeId, unit) {
  const unitQuery = encodeURIComponent(`${unit} grade ${gradeId} sri lanka mathematics`);
  return [
    {
      id: `yt-${slugify(unit)}-search`,
      title: `${unit} - related lesson search`,
      url: `https://www.youtube.com/results?search_query=${unitQuery}`
    },
    {
      id: `yt-${slugify(unit)}-nie`,
      title: 'NIE mathematics lesson video',
      url: 'https://www.youtube.com/watch?v=JJZqdTpBJW0'
    },
    {
      id: `yt-${slugify(unit)}-ethaksalawa`,
      title: 'e-Thaksalawa YouTube channel',
      url: 'https://www.youtube.com/@ethaksalawa'
    },
    {
      id: `yt-${slugify(unit)}-dpedu`,
      title: 'DP Education official channel',
      url: 'https://www.youtube.com/@DPEducationOfficial'
    }
  ];
}

// Add some grade-specific helpful videos (Hello Maths for Grade 10)
function buildTutorials(gradeId, unit) {
  // original implementation above; this wrapper will augment for grade 10
  const base = (function() {
    const unitQuery = encodeURIComponent(`${unit} grade ${gradeId} sri lanka mathematics`);
    return [
      {
        id: `yt-${slugify(unit)}-search`,
        title: `${unit} - related lesson search`,
        url: `https://www.youtube.com/results?search_query=${unitQuery}`
      },
      {
        id: `yt-${slugify(unit)}-nie`,
        title: 'NIE mathematics lesson video',
        url: 'https://www.youtube.com/watch?v=JJZqdTpBJW0'
      },
      {
        id: `yt-${slugify(unit)}-ethaksalawa`,
        title: 'e-Thaksalawa YouTube channel',
        url: 'https://www.youtube.com/@ethaksalawa'
      },
      {
        id: `yt-${slugify(unit)}-dpedu`,
        title: 'DP Education official channel',
        url: 'https://www.youtube.com/@DPEducationOfficial'
      }
    ];
  })();

  if (gradeId === '10') {
    // Hello Maths Grade 10 video (useful for many Term 1 topics)
    base.unshift({ id: `yt-${slugify(unit)}-hello-maths`, title: 'Hello Maths - related video', url: 'https://www.youtube.com/watch?v=X9hs8bW4fVs' });
  }

  return base;
}

function buildTopic(gradeId, term, unit) {
  const allResources = uniqueByUrl([...GRADE_RESOURCE_LINKS[gradeId], ...BASE_RESOURCES]);
  const theoryResources = allResources.filter(r => (r.type || 'theory') === 'theory');
  const paperResources = uniqueByUrl([...GRADE_QUESTION_LINKS[gradeId], ...BASE_RESOURCES.filter((item) => (item.type || '') === 'papers')]);

  return {
    id: slugify(unit),
    title: unit,
    term,
    tutorials: buildTutorials(gradeId, unit), // youtube links
    resources: theoryResources, // textbooks / theory pages
    papers: paperResources, // past paper links
    studentQuestions: []
  };
}

function buildGrade(gradeId) {
  const topics = Object.entries(TERM_UNITS[gradeId]).flatMap(([term, units]) => units.map((unit) => buildTopic(gradeId, term, unit)));
  return {
    id: gradeId,
    title: `Grade ${gradeId}`,
    resources: uniqueByUrl([...GRADE_RESOURCE_LINKS[gradeId], ...BASE_RESOURCES]),
    topics
  };
}

let data = {
  grades: [buildGrade('9'), buildGrade('10'), buildGrade('11')]
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

app.post('/api/questions', async (req, res) => {
  const { name, email, question, grade, unit } = req.body;

  if (!name || !email || !question) {
    return res.status(400).json({ error: 'Name, email and question are required.' });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const receiver = process.env.QUESTION_RECEIVER_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !receiver) {
    return res.status(500).json({
      error: 'Email is not configured on the server. Add SMTP_HOST, SMTP_USER, SMTP_PASS and QUESTION_RECEIVER_EMAIL in backend/.env.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const fromAddress = process.env.SMTP_FROM || smtpUser;

    await transporter.sendMail({
      from: fromAddress,
      to: receiver,
      replyTo: email,
      subject: `New Math Question${grade ? ` - Grade ${grade}` : ''}${unit ? ` - ${unit}` : ''}`,
      text: `Name: ${name}\nEmail: ${email}\nGrade: ${grade || 'Not selected'}\nUnit: ${unit || 'Not selected'}\n\nQuestion:\n${question}`
    });

    return res.json({ status: 'sent' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email. Check SMTP credentials and app password.' });
  }
});

// Student questions: get and post per topic
app.get('/api/topic/:gradeId/:topicId/questions', (req, res) => {
  const { gradeId, topicId } = req.params;
  const grade = data.grades.find(g => g.id === gradeId);
  if (!grade) return res.status(404).json({ error: 'Grade not found' });
  const topic = grade.topics.find(t => t.id === topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  res.json(topic.studentQuestions || []);
});

app.post('/api/topic/:gradeId/:topicId/questions', (req, res) => {
  const { gradeId, topicId } = req.params;
  const { name, email, question } = req.body;
  if (!name || !question) return res.status(400).json({ error: 'Name and question are required' });
  const grade = data.grades.find(g => g.id === gradeId);
  if (!grade) return res.status(404).json({ error: 'Grade not found' });
  const topic = grade.topics.find(t => t.id === topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const q = { id: `q-${Date.now()}`, name, email: email || '', question, replies: [], createdAt: new Date().toISOString() };
  topic.studentQuestions.push(q);
  res.json(q);
});

app.post('/api/topic/:gradeId/:topicId/questions/:qid/replies', (req, res) => {
  const { gradeId, topicId, qid } = req.params;
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Name and message are required' });
  const grade = data.grades.find(g => g.id === gradeId);
  if (!grade) return res.status(404).json({ error: 'Grade not found' });
  const topic = grade.topics.find(t => t.id === topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const q = topic.studentQuestions.find(x => x.id === qid);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  const reply = { id: `r-${Date.now()}`, name, message, createdAt: new Date().toISOString() };
  q.replies = q.replies || [];
  q.replies.push(reply);
  res.json(reply);
});

// Admin can answer a student question (protected)
app.post('/api/topic/:gradeId/:topicId/questions/:qid/answer', authenticateToken, (req, res) => {
  const { gradeId, topicId, qid } = req.params;
  const { answer } = req.body;
  if (!answer) return res.status(400).json({ error: 'Answer is required' });
  const grade = data.grades.find(g => g.id === gradeId);
  if (!grade) return res.status(404).json({ error: 'Grade not found' });
  const topic = grade.topics.find(t => t.id === topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const q = topic.studentQuestions.find(x => x.id === qid);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  q.answer = { text: answer, answeredAt: new Date().toISOString() };
  q.replies = q.replies || [];
  q.replies.push({ id: `r-${Date.now()}`, name: 'Admin', message: answer, createdAt: new Date().toISOString(), isAdmin: true });
  res.json(q);
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
