const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, membership_tier),
        forum_replies!post_id (id)
      `, { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: posts, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const formattedPosts = (posts || []).map(p => ({
      ...p,
      author: p.profiles,
      reply_count: p.forum_replies?.length || 0
    }));

    res.json({
      posts: formattedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts.' });
  }
});

router.get('/posts/:id', optionalAuth, async (req, res) => {
  try {
    const { data: post, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        profiles:user_id (id, full_name, avatar_url, membership_tier)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const { data: replies } = await supabase
      .from('forum_replies')
      .select(`
        *,
        profiles:user_id (id, full_name, avatar_url, membership_tier)
      `)
      .eq('post_id', req.params.id)
      .order('created_at', { ascending: true });

    res.json({
      post: {
        ...post,
        author: post.profiles
      },
      replies: (replies || []).map(r => ({
        ...r,
        author: r.profiles
      }))
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to get post.' });
  }
});

router.post('/posts', auth, [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category').optional().trim(),
], validate, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: req.user.id,
        title,
        content,
        category: category || 'general'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Post created successfully!',
      post: data
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

router.put('/posts/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('content').optional().trim().isLength({ min: 10 }),
], validate, async (req, res) => {
  try {
    const { data: existingPost } = await supabase
      .from('forum_posts')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this post.' });
    }

    const { title, content } = req.body;
    const updates = {};
    
    if (title) updates.title = title;
    if (content) updates.content = content;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('forum_posts')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Post updated successfully.' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post.' });
  }
});

router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const { data: existingPost } = await supabase
      .from('forum_posts')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post.' });
    }

    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post.' });
  }
});

router.post('/posts/:id/reply', auth, [
  body('content').trim().isLength({ min: 2 }).withMessage('Reply must be at least 2 characters'),
], validate, async (req, res) => {
  try {
    const { data: existingPost } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const { content } = req.body;

    const { data, error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: req.params.id,
        user_id: req.user.id,
        content
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Reply added successfully!',
      reply: data
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Failed to add reply.' });
  }
});

router.delete('/replies/:id', auth, async (req, res) => {
  try {
    const { data: existingReply } = await supabase
      .from('forum_replies')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!existingReply) {
      return res.status(404).json({ error: 'Reply not found.' });
    }

    if (existingReply.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this reply.' });
    }

    const { error } = await supabase
      .from('forum_replies')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Reply deleted successfully.' });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ error: 'Failed to delete reply.' });
  }
});

module.exports = router;
