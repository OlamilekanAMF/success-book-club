const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { sort = 'popular' } = req.query;

    let query = supabase
      .from('book_recommendations')
      .select(`
        *,
        profiles:user_id (full_name)
      `);

    if (sort === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('votes', { ascending: false });
    }

    const { data: recommendations, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const formattedRecs = (recommendations || []).map(rec => ({
      ...rec,
      author_name: rec.profiles?.full_name,
      user_voted: false
    }));

    if (req.user) {
      for (let rec of formattedRecs) {
        const { data: userVote } = await supabase
          .from('recommendation_votes')
          .select('id')
          .eq('recommendation_id', rec.id)
          .eq('user_id', req.user.id)
          .single();
        
        rec.user_voted = !!userVote;
      }
    }

    res.json({ recommendations: formattedRecs });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations.' });
  }
});

router.post('/', auth, [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title required'),
  body('author').optional().trim(),
  body('description').optional().trim().isLength({ max: 500 }),
], validate, async (req, res) => {
  try {
    const { title, author, description } = req.body;

    const { data, error } = await supabase
      .from('book_recommendations')
      .insert({
        user_id: req.user.id,
        title,
        author: author || null,
        description: description || null,
        votes: 0
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Recommendation added!',
      recommendation: {
        ...data,
        user_voted: false
      }
    });
  } catch (error) {
    console.error('Add recommendation error:', error);
    res.status(500).json({ error: 'Failed to add recommendation.' });
  }
});

router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { data: recommendation } = await supabase
      .from('book_recommendations')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found.' });
    }

    const { data: existingVote } = await supabase
      .from('recommendation_votes')
      .select('id')
      .eq('recommendation_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted for this recommendation.' });
    }

    await supabase
      .from('recommendation_votes')
      .insert({
        recommendation_id: req.params.id,
        user_id: req.user.id
      });

    await supabase
      .from('book_recommendations')
      .update({ votes: supabase.raw('votes + 1') })
      .eq('id', req.params.id);

    res.json({ message: 'Vote recorded!', user_voted: true });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote.' });
  }
});

router.delete('/:id/vote', auth, async (req, res) => {
  try {
    const { data: existingVote } = await supabase
      .from('recommendation_votes')
      .select('id')
      .eq('recommendation_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (!existingVote) {
      return res.status(400).json({ error: 'You have not voted for this recommendation.' });
    }

    await supabase
      .from('recommendation_votes')
      .delete()
      .eq('recommendation_id', req.params.id)
      .eq('user_id', req.user.id);

    await supabase
      .from('book_recommendations')
      .update({ votes: supabase.raw('GREATEST(votes - 1, 0)') })
      .eq('id', req.params.id);

    res.json({ message: 'Vote removed.', user_voted: false });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({ error: 'Failed to remove vote.' });
  }
});

module.exports = router;
