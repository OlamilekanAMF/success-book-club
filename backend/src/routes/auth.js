const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supabase = require('../config/supabase');
const config = require('../config/auth');
const { validate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('full_name').trim().isLength({ min: 2 }).withMessage('Name is required'),
], validate, async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return res.status(400).json({ error: 'Email already registered. Please log in.' });
      }
      return res.status(400).json({ error: error.message });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify.',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: full_name,
        membership_tier: profile?.membership_tier || 'free'
      },
      session: data.session
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      message: 'Login successful!',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profile?.full_name || data.user.email,
        avatar_url: profile?.avatar_url,
        membership_tier: profile?.membership_tier || 'free'
      },
      session: data.session
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Logout failed.' });
    }

    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed.' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: profile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user.' });
  }
});

router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], validate, async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.frontend.url}/reset-password`
    });

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

router.post('/reset-password', [
  body('password').isLength({ min: 8 }),
], validate, async (req, res) => {
  try {
    const { password } = req.body;

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password reset successful. Please log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required.' });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    res.json({
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${config.frontend.url}/community.html?welcome=google`
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ url: data.url });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google login failed.' });
  }
});

router.post('/facebook', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${config.frontend.url}/community.html?welcome=facebook`
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ url: data.url });
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(500).json({ error: 'Facebook login failed.' });
  }
});

router.get('/callback/google', async (req, res) => {
  try {
    const { code } = req.query;
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return res.redirect(`${config.frontend.url}/login?error=oauth`);
    }

    res.redirect(`${config.frontend.url}/community.html?welcome=google`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${config.frontend.url}/login?error=oauth`);
  }
});

router.get('/callback/facebook', async (req, res) => {
  try {
    const { code } = req.query;
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return res.redirect(`${config.frontend.url}/login?error=oauth`);
    }

    res.redirect(`${config.frontend.url}/community.html?welcome=facebook`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${config.frontend.url}/login?error=oauth`);
  }
});

module.exports = router;
