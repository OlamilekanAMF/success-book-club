require('dotenv').config({ path: __dirname + '/../../.env' });
const config = require('./auth');
const db = require('./database');

// Only require OAuth libraries if credentials are set
let GoogleStrategy, FacebookStrategy;

function hasValue(val) {
  return val && typeof val === 'string' && val.trim().length > 0;
}

console.log('=== OAuth Config Check ===');
console.log('Google Client ID:', config.oauth.google.clientID ? 'SET' : 'NOT SET');
console.log('Google Client Secret:', config.oauth.google.clientSecret ? 'SET' : 'NOT SET');
console.log('Facebook App ID:', config.oauth.facebook.appID ? 'SET' : 'NOT SET');
console.log('Facebook App Secret:', config.oauth.facebook.appSecret ? 'SET' : 'NOT SET');

try {
  if (hasValue(config.oauth.google.clientID) && hasValue(config.oauth.google.clientSecret)) {
    GoogleStrategy = require('passport-google-oauth20').Strategy;
    console.log('✅ Google OAuth enabled');
  } else {
    console.log('ℹ️  Google OAuth disabled (no credentials)');
  }
  
  if (hasValue(config.oauth.facebook.appID) && hasValue(config.oauth.facebook.appSecret)) {
    FacebookStrategy = require('passport-facebook').Strategy;
    console.log('✅ Facebook OAuth enabled');
  } else {
    console.log('ℹ️  Facebook OAuth disabled (no credentials)');
  }
} catch (e) {
  console.log('OAuth libraries not loaded:', e.message);
}

module.exports = (passport) => {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.execute(
        'SELECT id, email, full_name, avatar_url, membership_tier FROM users WHERE id = ?',
        [id]
      );
      if (rows.length > 0) {
        done(null, rows[0]);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, null);
    }
  });

  // Google Strategy
  if (GoogleStrategy) {
    passport.use(new GoogleStrategy({
      clientID: config.oauth.google.clientID,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: config.oauth.google.callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const [existingUser] = await db.execute(
          'SELECT * FROM users WHERE google_id = ? OR email = ?',
          [profile.id, profile.emails[0].value]
        );

        if (existingUser.length > 0) {
          if (!existingUser[0].google_id) {
            await db.execute(
              'UPDATE users SET google_id = ? WHERE id = ?',
              [profile.id, existingUser[0].id]
            );
          }
          return done(null, existingUser[0]);
        }

        const [result] = await db.execute(
          `INSERT INTO users (email, full_name, avatar_url, google_id, membership_tier) 
           VALUES (?, ?, ?, ?, 'free')`,
          [
            profile.emails[0].value,
            profile.displayName,
            profile.photos[0]?.value || null,
            profile.id
          ]
        );

        const [newUser] = await db.execute(
          'SELECT * FROM users WHERE id = ?',
          [result.insertId]
        );

        return done(null, newUser[0]);
      } catch (err) {
        return done(err, null);
      }
    }));
  }

  // Facebook Strategy - use clientID instead of appID
  if (FacebookStrategy) {
    passport.use(new FacebookStrategy({
      clientID: config.oauth.facebook.appID,
      clientSecret: config.oauth.facebook.appSecret,
      callbackURL: config.oauth.facebook.callbackURL,
      profileFields: ['id', 'displayName', 'emails', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.local`;

        const [existingUser] = await db.execute(
          'SELECT * FROM users WHERE facebook_id = ? OR email = ?',
          [profile.id, email]
        );

        if (existingUser.length > 0) {
          if (!existingUser[0].facebook_id) {
            await db.execute(
              'UPDATE users SET facebook_id = ? WHERE id = ?',
              [profile.id, existingUser[0].id]
            );
          }
          return done(null, existingUser[0]);
        }

        const [result] = await db.execute(
          `INSERT INTO users (email, full_name, avatar_url, facebook_id, membership_tier) 
           VALUES (?, ?, ?, ?, 'free')`,
          [
            email,
            profile.displayName,
            profile.photos?.[0]?.value || null,
            profile.id
          ]
        );

        const [newUser] = await db.execute(
          'SELECT * FROM users WHERE id = ?',
          [result.insertId]
        );

        return done(null, newUser[0]);
      } catch (err) {
        return done(err, null);
      }
    }));
  }
};
