const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

function isPremiumAuthor(user) {
  return user?.membership_tier === 'premium' || user?.membership_tier === 'author';
}

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { upcoming, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('events')
      .select(`
        *,
        profiles:created_by (full_name, avatar_url, membership_tier)
      `, { count: 'exact' })
      .order('event_date', { ascending: true });

    if (upcoming === 'true') {
      query = query.gte('event_date', new Date().toISOString());
    }

    const { data: events, count, error } = await query
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const formattedEvents = (events || []).map(event => ({
      ...event,
      created_by_user: event.profiles,
      creator_name: event.profiles?.full_name
    }));

    res.json({
      events: formattedEvents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events.' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles:created_by (full_name, avatar_url, membership_tier)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const { data: registrations } = await supabase
      .from('event_registrations')
      .select('user_id')
      .eq('event_id', req.params.id);

    let userRegistered = false;
    if (req.user) {
      userRegistered = (registrations || []).some(r => r.user_id === req.user.id);
    }

    res.json({
      event: {
        ...event,
        created_by_user: event.profiles,
        creator_name: event.profiles?.full_name
      },
      registrations_count: registrations?.length || 0,
      user_registered: userRegistered
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to get event.' });
  }
});

router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title is required'),
  body('event_date').notEmpty().withMessage('Event date is required'),
], validate, async (req, res) => {
  try {
    if (!isPremiumAuthor(req.user)) {
      return res.status(403).json({ error: 'Premium or Author membership required to create events.' });
    }

    const { title, description, event_date, event_type, location, cover_image } = req.body;

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description: description || null,
        event_date,
        event_type: event_type || 'virtual',
        location: location || null,
        cover_image: cover_image || null,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Event created!',
      event: data
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', req.params.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (existing.created_by !== req.user.id && !isPremiumAuthor(req.user)) {
      return res.status(403).json({ error: 'Not authorized to delete this event.' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Event deleted.' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

router.post('/:id/register', auth, async (req, res) => {
  try {
    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const { data: existing } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    const { error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: req.params.id,
        user_id: req.user.id
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Successfully registered for event!' });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({ error: 'Failed to register for event.' });
  }
});

router.delete('/:id/register', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Registration cancelled.' });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({ error: 'Failed to cancel registration.' });
  }
});

module.exports = router;
