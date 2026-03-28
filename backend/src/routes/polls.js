const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const { validate } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    for (let poll of polls || []) {
      const { data: options } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', poll.id)
        .order('id', { ascending: true });

      const { data: votes } = await supabase
        .from('poll_votes')
        .select('option_id')
        .eq('poll_id', poll.id);

      const totalVotes = votes?.length || 0;
      
      poll.options = (options || []).map(opt => ({
        ...opt,
        percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
      }));

      if (req.user) {
        const { data: userVote } = await supabase
          .from('poll_votes')
          .select('option_id')
          .eq('poll_id', poll.id)
          .eq('user_id', req.user.id)
          .single();
        
        poll.user_voted = userVote?.option_id || null;
      } else {
        poll.user_voted = null;
      }
    }

    res.json({ polls: polls || [] });
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ error: 'Failed to get polls.' });
  }
});

router.post('/:id/vote', auth, [
  body('option_id').notEmpty().withMessage('Valid option required'),
], validate, async (req, res) => {
  try {
    const { option_id } = req.body;

    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, active')
      .eq('id', req.params.id)
      .single();

    if (pollError || !poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    if (!poll.active) {
      return res.status(400).json({ error: 'This poll is no longer active.' });
    }

    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('id')
      .eq('id', option_id)
      .eq('poll_id', req.params.id)
      .single();

    if (optionError || !option) {
      return res.status(400).json({ error: 'Invalid option for this poll.' });
    }

    const { data: existingVote } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted in this poll.' });
    }

    await supabase
      .from('poll_votes')
      .insert({
        poll_id: req.params.id,
        user_id: req.user.id,
        option_id
      });

    await supabase
      .from('poll_options')
      .update({ votes: supabase.raw('votes + 1') })
      .eq('id', option_id);

    const { data: updatedPoll } = await supabase
      .from('polls')
      .select('*')
      .eq('id', req.params.id)
      .single();

    const { data: options } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', req.params.id)
      .order('id', { ascending: true });

    const { data: votes } = await supabase
      .from('poll_votes')
      .select('option_id')
      .eq('poll_id', req.params.id);

    const totalVotes = votes?.length || 0;

    updatedPoll.options = options.map(opt => ({
      ...opt,
      percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
    }));

    res.json({
      message: 'Vote recorded successfully!',
      poll: updatedPoll
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to record vote.' });
  }
});

module.exports = router;
