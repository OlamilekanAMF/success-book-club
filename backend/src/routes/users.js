const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { data: postCount } = await supabase
      .from('forum_posts')
      .select('id', { count: 'exact' })
      .eq('user_id', req.user.id);

    const { data: replyCount } = await supabase
      .from('forum_replies')
      .select('id', { count: 'exact' })
      .eq('user_id', req.user.id);

    const { data: libraryCount } = await supabase
      .from('user_library')
      .select('id', { count: 'exact' })
      .eq('user_id', req.user.id);

    res.json({
      user: {
        ...profile,
        stats: {
          post_count: postCount?.length || 0,
          reply_count: replyCount?.length || 0,
          library_count: libraryCount?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
});

router.put('/me', auth, [
  body('full_name').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('interests').optional().isArray(),
], validate, async (req, res) => {
  try {
    const { full_name, bio, interests } = req.body;

    const updates = {};

    if (full_name) updates.full_name = full_name;
    if (bio !== undefined) updates.bio = bio;
    if (interests) updates.interests = JSON.stringify(interests);
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Profile updated successfully.',
      user: data
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

router.post('/avatar', auth, [
  body('avatar_url').isURL().withMessage('Valid image URL required'),
], validate, async (req, res) => {
  try {
    const { avatar_url } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url, updated_at: new Date().toISOString() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Avatar updated.', avatar_url: data.avatar_url });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar.' });
  }
});

router.put('/me/password', auth, [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], validate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: current_password
    });

    if (signInError) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password
    });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

router.put('/me/upgrade', auth, [
  body('tier').isIn(['free', 'premium', 'author']).withMessage('Invalid tier'),
], validate, async (req, res) => {
  try {
    const { tier } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ membership_tier: tier, updated_at: new Date().toISOString() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: `Successfully upgraded to ${tier}!`,
      user: data
    });
  } catch (error) {
    console.error('Upgrade tier error:', error);
    res.status(500).json({ error: 'Failed to upgrade membership.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, interests, membership_tier, created_at')
      .eq('id', req.params.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { data: postCount } = await supabase
      .from('forum_posts')
      .select('id', { count: 'exact' })
      .eq('user_id', req.params.id);

    const { data: replyCount } = await supabase
      .from('forum_replies')
      .select('id', { count: 'exact' })
      .eq('user_id', req.params.id);

    res.json({
      user: {
        ...profile,
        stats: {
          post_count: postCount?.length || 0,
          reply_count: replyCount?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, interests, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, interests, membership_tier', { count: 'exact' });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    if (interests) {
      const interestList = interests.split(',');
      interestList.forEach(interest => {
        query = query.ilike('interests', `%${interest}%`);
      });
    }

    const { data: profiles, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      users: profiles || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users.' });
  }
});

module.exports = router;
