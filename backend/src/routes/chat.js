const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/:room', optionalAuth, async (req, res) => {
  try {
    const { room } = req.params;
    const { limit = 50 } = req.query;

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*, profiles:user_id (full_name, avatar_url)')
      .eq('room_id', room)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      room,
      messages: (messages || []).reverse().map(m => ({
        ...m,
        username: m.profiles?.full_name || m.username,
        avatar_url: m.profiles?.avatar_url
      }))
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages.' });
  }
});

router.post('/', auth, [
  body('room_id').notEmpty().withMessage('Room ID required'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message required (max 500 chars)'),
], validate, async (req, res) => {
  try {
    const { room_id, message } = req.body;

    const validRooms = ['general', 'monthly-pick', 'new-releases'];
    if (!validRooms.includes(room_id)) {
      return res.status(400).json({ error: 'Invalid chat room.' });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id,
        user_id: req.user.id,
        username: req.user.full_name,
        message
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Message sent!',
      chat: {
        ...data,
        avatar_url: req.user.avatar_url
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

router.get('/:room/active', async (req, res) => {
  try {
    const { room } = req.params;

    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', room)
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    res.json({
      room,
      active_count: Math.min(count || 0, 20),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get active error:', error);
    res.status(500).json({ error: 'Failed to get active users.' });
  }
});

module.exports = router;
