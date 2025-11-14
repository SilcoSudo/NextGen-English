const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔐 Google OAuth Profile:', {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value
      });

      // Tìm user theo Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        console.log('✅ User found by Google ID:', user.email);
        return done(null, user);
      }

      // Nếu không tìm thấy, kiểm tra xem có user nào dùng email này không
      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
      if (user) {
        // Nếu có, link Google ID vào user hiện có
        console.log('🔗 Linking Google ID to existing user:', user.email);
        user.googleId = profile.id;
        if (!user.avatar) {
          user.avatar = profile.photos?.[0]?.value;
        }
        await user.save();
        return done(null, user);
      }

      // Tạo user mới nếu chưa có
      console.log('👤 Creating new user from Google profile');
      user = new User({
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value,
        role: 'student',
        isActive: true,
        emailVerified: true // Google verified email
      });
      
      await user.save();
      console.log('✅ New user created:', user.email);
      
      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
