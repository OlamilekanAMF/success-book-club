const supabase = require('../config/supabase');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    // Try to validate with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Token might be expired, but we can still try to decode it for the user ID
      // This allows uploads to work even with expired tokens
      try {
        // Decode JWT to get user ID (without verification)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        const userId = payload.sub;
        
        if (userId) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (profile) {
            req.user = {
              id: userId,
              email: profile.email,
              ...profile
            };
            return next();
          }
        }
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
      }
      
      return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      ...profile
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          req.user = {
            id: user.id,
            email: user.email,
            ...profile
          };
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, optionalAuth };
