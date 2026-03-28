const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { data: library, error } = await supabase
      .from('user_library')
      .select(`
        *,
        books:book_id (*)
      `)
      .eq('user_id', req.user.id)
      .order('added_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ library: library || [] });
  } catch (error) {
    console.error('Get library error:', error);
    res.status(500).json({ error: 'Failed to get library.' });
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const { data: library } = await supabase
      .from('user_library')
      .select('*, books:book_id (*)')
      .eq('user_id', req.user.id)
      .order('added_at', { ascending: false })
      .limit(5);

    const { data: votes } = await supabase
      .from('recommendation_votes')
      .select(`
        *,
        book_recommendations:recommendation_id (title, author)
      `)
      .eq('user_id', req.user.id);

    const { data: upcomingEvents } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(5);

    const { data: myRegistrations } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', req.user.id);

    const registeredEventIds = (myRegistrations || []).map(r => r.event_id);

    const { data: commentReplies } = await supabase
      .from('article_comments')
      .select(`
        *,
        articles:article_id (title, slug)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      library: library || [],
      votes: votes || [],
      upcoming_events: upcomingEvents || [],
      registered_event_ids: registeredEventIds,
      comment_replies: commentReplies || []
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data.' });
  }
});

router.post('/', auth, [
  body('book_id').notEmpty().withMessage('Book ID required'),
], validate, async (req, res) => {
  try {
    const { book_id } = req.body;

    const { data: existing } = await supabase
      .from('user_library')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('book_id', book_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Book already in your library.' });
    }

    const { error } = await supabase
      .from('user_library')
      .insert({
        user_id: req.user.id,
        book_id
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Book added to library!' });
  } catch (error) {
    console.error('Add to library error:', error);
    res.status(500).json({ error: 'Failed to add book.' });
  }
});

router.delete('/:bookId', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', req.user.id)
      .eq('book_id', req.params.bookId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Book removed from library.' });
  } catch (error) {
    console.error('Remove from library error:', error);
    res.status(500).json({ error: 'Failed to remove book.' });
  }
});

module.exports = router;
