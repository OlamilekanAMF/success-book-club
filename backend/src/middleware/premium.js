const db = require('../config/database');

const premiumOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.user.membership_tier !== 'premium') {
      return res.status(403).json({ 
        error: 'Premium membership required.',
        code: 'PREMIUM_REQUIRED',
        upgradeUrl: '/premium'
      });
    }

    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    return res.status(500).json({ error: 'Authorization error.' });
  }
};

const freeOnly = async (req, res, next) => {
  try {
    // This middleware is for features that premium users should NOT access
    // For example: certain promotional content
    
    // For now, this is a placeholder - can be expanded later
    next();
  } catch (error) {
    console.error('Free only middleware error:', error);
    return res.status(500).json({ error: 'Authorization error.' });
  }
};

module.exports = { premiumOnly, freeOnly };
