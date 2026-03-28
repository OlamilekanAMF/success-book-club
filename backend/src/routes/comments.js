const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/:articleId/comments', optionalAuth, async (req, res) => {
  try {
    const { data: article } = await supabase
      .from('articles')
      .select('id, published')
      .eq('id', req.params.articleId)
      .single();

    if (!article || !article.published) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const { data: comments, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', req.params.articleId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const commentMap = {};
    const topLevelComments = [];

    (comments || []).forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    (comments || []).forEach(comment => {
      if (comment.parent_id) {
        if (commentMap[comment.parent_id]) {
          commentMap[comment.parent_id].replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    res.json({ comments: topLevelComments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments.' });
  }
});

router.post('/:articleId/comments', auth, [
  body('content').trim().isLength({ min: 2 }).withMessage('Comment must be at least 2 characters'),
], validate, async (req, res) => {
  try {
    const { data: article } = await supabase
      .from('articles')
      .select('id, published')
      .eq('id', req.params.articleId)
      .single();

    if (!article || !article.published) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const { content } = req.body;

    const { data, error } = await supabase
      .from('article_comments')
      .insert({
        article_id: req.params.articleId,
        user_id: req.user.id,
        author_name: req.user.full_name || 'Anonymous',
        author_avatar: req.user.avatar_url || null,
        content
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Comment added!',
      comment: data
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to add comment.' });
  }
});

router.post('/comments/:commentId/reply', auth, [
  body('content').trim().isLength({ min: 2 }).withMessage('Reply must be at least 2 characters'),
], validate, async (req, res) => {
  try {
    const { data: parentComment } = await supabase
      .from('article_comments')
      .select('*, articles!inner(published)')
      .eq('id', req.params.commentId)
      .single();

    if (!parentComment || !parentComment.articles?.published) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    const { content } = req.body;

    const { data, error } = await supabase
      .from('article_comments')
      .insert({
        article_id: parentComment.article_id,
        user_id: req.user.id,
        parent_id: req.params.commentId,
        author_name: req.user.full_name || 'Anonymous',
        author_avatar: req.user.avatar_url || null,
        content
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: parentUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', parentComment.user_id)
      .single();

    if (parentUser && parentUser.id !== req.user.id) {
      await supabase.rpc('create_notification', {
        p_user_id: parentUser.id,
        p_type: 'comment_reply',
        p_title: 'New Reply',
        p_message: `${req.user.full_name || 'Someone'} replied to your comment`,
        p_data: {
          article_id: parentComment.article_id,
          comment_id: req.params.commentId,
          reply_id: data.id
        }
      });
    }

    res.status(201).json({
      message: 'Reply added!',
      comment: data
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Failed to add reply.' });
  }
});

router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const { data: comment } = await supabase
      .from('article_comments')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment.' });
    }

    const { error } = await supabase
      .from('article_comments')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Comment deleted.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
});

module.exports = router;
