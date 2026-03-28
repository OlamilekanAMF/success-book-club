const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key');
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Admin Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Generate JWT
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role,
        isAdmin: true 
      },
      process.env.JWT_SECRET || 'admin-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Dashboard Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get counts from various tables
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: bookCount } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });

    const { count: articleCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    const { count: pendingApprovals } = await supabase
      .from('author_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: newsletterCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    const { count: challengeCount } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: pressCount } = await supabase
      .from('press')
      .select('*', { count: 'exact', head: true });

    const { count: podcastCount } = await supabase
      .from('podcasts')
      .select('*', { count: 'exact', head: true });

    res.json({
      users: userCount || 0,
      books: bookCount || 0,
      articles: articleCount || 0,
      pendingApprovals: pendingApprovals || 0,
      newsletter: newsletterCount || 0,
      challenges: challengeCount || 0,
      press: pressCount || 0,
      podcasts: podcastCount || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// Books Management
router.get('/books', adminAuth, async (req, res) => {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ books: books || [] });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to load books' });
  }
});

router.post('/books', adminAuth, [
  body('title').trim().notEmpty(),
  body('author').trim().notEmpty(),
], validate, async (req, res) => {
  try {
    const { title, author, description, cover_image, category, genre } = req.body;

    const { data, error } = await supabase
      .from('books')
      .insert({
        title,
        author,
        description,
        cover_image,
        category,
        genre,
        created_by: req.admin.id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ book: data, message: 'Book added successfully' });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

router.put('/books/:id', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ book: data, message: 'Book updated successfully' });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

router.delete('/books/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Press Management
router.get('/press', adminAuth, async (req, res) => {
  try {
    const { data: press, error } = await supabase
      .from('press')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ press: press || [] });
  } catch (error) {
    console.error('Get press error:', error);
    res.status(500).json({ error: 'Failed to load press releases' });
  }
});

router.post('/press', adminAuth, [
  body('title').trim().notEmpty(),
], validate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('press')
      .insert({
        ...req.body,
        created_by: req.admin.id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ press: data, message: 'Press release added' });
  } catch (error) {
    console.error('Add press error:', error);
    res.status(500).json({ error: 'Failed to add press release' });
  }
});

// Podcast Management
router.get('/podcasts', adminAuth, async (req, res) => {
  try {
    const { data: podcasts, error } = await supabase
      .from('podcasts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ podcasts: podcasts || [] });
  } catch (error) {
    console.error('Get podcasts error:', error);
    res.status(500).json({ error: 'Failed to load podcasts' });
  }
});

router.post('/podcasts', adminAuth, [
  body('title').trim().notEmpty(),
], validate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('podcasts')
      .insert({
        ...req.body,
        created_by: req.admin.id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ podcast: data, message: 'Podcast episode added' });
  } catch (error) {
    console.error('Add podcast error:', error);
    res.status(500).json({ error: 'Failed to add podcast' });
  }
});

// Challenges Management
router.get('/challenges', adminAuth, async (req, res) => {
  try {
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ challenges: challenges || [] });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Failed to load challenges' });
  }
});

router.post('/challenges', adminAuth, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
], validate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .insert({
        ...req.body,
        created_by: req.admin.id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ challenge: data, message: 'Challenge created' });
  } catch (error) {
    console.error('Add challenge error:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Author Applications
router.get('/author-applications', adminAuth, async (req, res) => {
  try {
    const { data: applications, error } = await supabase
      .from('author_applications')
      .select(`
        *,
        profiles:user_id (full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ applications: applications || [] });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

router.put('/author-applications/:id/approve', adminAuth, async (req, res) => {
  try {
    // Update application status
    const { data: application } = await supabase
      .from('author_applications')
      .update({ status: 'approved', approved_by: req.admin.id })
      .eq('id', req.params.id)
      .select()
      .single();

    // Update user role to author
    await supabase
      .from('profiles')
      .update({ membership_tier: 'author' })
      .eq('id', application.user_id);

    res.json({ message: 'Author approved successfully' });
  } catch (error) {
    console.error('Approve author error:', error);
    res.status(500).json({ error: 'Failed to approve author' });
  }
});

// Newsletter Subscribers
router.get('/newsletter', adminAuth, async (req, res) => {
  try {
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;

    res.json({ subscribers: subscribers || [] });
  } catch (error) {
    console.error('Get newsletter error:', error);
    res.status(500).json({ error: 'Failed to load subscribers' });
  }
});

router.post('/newsletter/send', adminAuth, [
  body('subject').trim().notEmpty(),
  body('content').trim().notEmpty(),
], validate, async (req, res) => {
  try {
    const { subject, content } = req.body;

    // Get all active subscribers
    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'active');

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, just log it
    console.log(`Sending newsletter to ${subscribers?.length || 0} subscribers`);
    console.log('Subject:', subject);
    console.log('Content:', content);

    res.json({ 
      message: `Newsletter queued for sending to ${subscribers?.length || 0} subscribers`,
      recipientCount: subscribers?.length || 0
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// User Management
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, membership_tier, created_at, avatar_url')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ users: users || [] });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ membership_tier: role })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ user: data, message: 'User role updated' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;
