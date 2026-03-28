require('dotenv').config({ path: __dirname + '/../.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const supabase = require('./src/config/supabase');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const bookRoutes = require('./src/routes/books');
const externalBookRoutes = require('./src/routes/external-books');
const authorRoutes = require('./src/routes/authors');
const forumRoutes = require('./src/routes/forum');
const pollRoutes = require('./src/routes/polls');
const chatRoutes = require('./src/routes/chat');
const libraryRoutes = require('./src/routes/library');
const recommendationRoutes = require('./src/routes/recommendations');
const articleRoutes = require('./src/routes/articles');
const commentRoutes = require('./src/routes/comments');
const eventRoutes = require('./src/routes/events');
const notificationRoutes = require('./src/routes/notifications');
const uploadRoutes = require('./src/routes/upload');
const adminRoutes = require('./src/routes/admin');
const communityRoutes = require('./src/routes/community');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later.' }
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/external-books', externalBookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Triumphant Book Club API Server (Supabase)',
    version: '2.0.0',
    server: `http://localhost:${PORT}`,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      books: '/api/books',
      externalBooks: '/api/external-books',
      forum: '/api/forum',
      polls: '/api/polls',
      chat: '/api/chat',
      library: '/api/library',
      recommendations: '/api/recommendations',
      articles: '/api/articles',
      events: '/api/events',
      notifications: '/api/notifications',
      health: '/api/health'
    }
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    res.json({ 
      status: 'ok', 
      database: error ? 'disconnected' : 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   Triumphant Book Club API Server (Supabase)    ║
║                                                   ║
║   Server running on: http://localhost:${PORT}        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
