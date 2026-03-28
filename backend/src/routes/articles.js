const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isPremiumAuthor(user) {
  return user?.membership_tier === 'premium' || user?.membership_tier === 'author';
}

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('articles')
      .select(`
        *,
        profiles:author_id (full_name, avatar_url, membership_tier)
      `, { count: 'exact' })
      .eq('published', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data: articles, count, error } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const formattedArticles = (articles || []).map(article => ({
      ...article,
      author: article.profiles,
      author_name: article.profiles?.full_name,
      author_avatar: article.profiles?.avatar_url
    }));

    res.json({
      articles: formattedArticles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to get articles.' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        profiles:author_id (full_name, avatar_url, membership_tier)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    if (!article.published) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const { data: comments } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', req.params.id)
      .order('created_at', { ascending: true });

    res.json({
      article: {
        ...article,
        author: article.profiles,
        author_name: article.profiles?.full_name,
        author_avatar: article.profiles?.avatar_url
      },
      comments: comments || []
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to get article.' });
  }
});

router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content is required'),
], validate, async (req, res) => {
  try {
    if (!isPremiumAuthor(req.user)) {
      return res.status(403).json({ error: 'Premium or Author membership required to create articles.' });
    }

    const { title, content, excerpt, cover_image, category, featured, published } = req.body;
    const slug = generateSlug(title) + '-' + Date.now();

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        cover_image: cover_image || null,
        category: category || 'General',
        featured: featured || false,
        published: published || false,
        published_at: published ? new Date().toISOString() : null,
        author_id: req.user.id
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: published ? 'Article published!' : 'Article saved as draft.',
      article: data
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', req.params.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    if (existing.author_id !== req.user.id && !isPremiumAuthor(req.user)) {
      return res.status(403).json({ error: 'Not authorized to edit this article.' });
    }

    const { title, content, excerpt, cover_image, category, featured, published } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (content) updates.content = content;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (cover_image !== undefined) updates.cover_image = cover_image;
    if (category) updates.category = category;
    if (featured !== undefined) updates.featured = featured;
    if (published !== undefined) {
      updates.published = published;
      updates.published_at = published ? new Date().toISOString() : null;
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Article updated.', article: data });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', req.params.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    if (existing.author_id !== req.user.id && !isPremiumAuthor(req.user)) {
      return res.status(403).json({ error: 'Not authorized to delete this article.' });
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Article deleted.' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article.' });
  }
});

router.get('/my-articles', auth, async (req, res) => {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('author_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ articles: articles || [] });
  } catch (error) {
    console.error('Get my articles error:', error);
    res.status(500).json({ error: 'Failed to get articles.' });
  }
});

module.exports = router;
