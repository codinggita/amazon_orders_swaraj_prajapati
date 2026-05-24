const passport = require('passport'); 
 const GoogleStrategy = require('passport-google-oauth20').Strategy; 
 const FacebookStrategy = require('passport-facebook').Strategy; 
 const User = require('../models/user.model'); 
 
 // ─── GOOGLE STRATEGY ─────────────────────────────────────────── 
 passport.use(new GoogleStrategy({ 
   clientID:     process.env.GOOGLE_CLIENT_ID, 
   clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
   callbackURL:  process.env.GOOGLE_CALLBACK_URL, 
   scope: ['profile', 'email'], 
   passReqToCallback: false, 
 }, 
 async (accessToken, refreshToken, profile, done) => { 
   try { 
     const email = profile.emails?.[0]?.value; 
     const name  = profile.displayName || 
                   `${profile.name?.givenName} ${profile.name?.familyName}`.trim(); 
     const googleId   = profile.id; 
     const avatarUrl  = profile.photos?.[0]?.value; 
 
     if (!email) { 
       return done(null, false, { message: 'No email from Google account' }); 
     } 
 
     // Check if user exists by googleId 
     let user = await User.findOne({ googleId }); 
 
     if (!user) { 
       // Check if email already registered (link accounts) 
       user = await User.findOne({ email: email.toLowerCase() }); 
 
       if (user) { 
         // Link Google to existing account 
         user.googleId  = googleId; 
         user.avatarUrl = user.avatarUrl || avatarUrl; 
         user.isEmailVerified = true; 
         user.authProvider = user.authProvider === 'local' ? 'both' : user.authProvider;
         await user.save(); 
       } else { 
         // Create new user via Google 
         user = await User.create({ 
           name, 
           email:           email.toLowerCase(), 
           googleId, 
           avatarUrl, 
           isEmailVerified: true, 
           isActive:        true, 
           role:            'user', 
           authProvider:    'google',
           // No password needed for OAuth users 
           password:        Math.random().toString(36) + Math.random().toString(36), 
         }); 
       } 
     } 
 
     if (!user.isActive) { 
       return done(null, false, { message: 'Account is deactivated' }); 
     } 
 
     // Update last login 
     user.lastLogin = new Date(); 
     await user.save(); 
 
     return done(null, user); 
 
   } catch (error) { 
     return done(error, false); 
   } 
 })); 
 
 // ─── FACEBOOK STRATEGY ───────────────────────────────────────── 
 passport.use(new FacebookStrategy({ 
   clientID:     process.env.FACEBOOK_APP_ID, 
   clientSecret: process.env.FACEBOOK_APP_SECRET, 
   callbackURL:  process.env.FACEBOOK_CALLBACK_URL, 
   profileFields: ['id', 'displayName', 'email', 'picture.type(large)', 'name'], 
   enableProof:   true, 
 }, 
 async (accessToken, refreshToken, profile, done) => { 
   try { 
     const email = profile.emails?.[0]?.value; 
     const name  = profile.displayName || 
                   `${profile.name?.givenName} ${profile.name?.familyName}`.trim(); 
     const facebookId = profile.id; 
     const avatarUrl  = profile.photos?.[0]?.value; 
 
     // Check if user exists by facebookId 
     let user = await User.findOne({ facebookId }); 
 
     if (!user) { 
       if (email) { 
         // Check if email already registered 
         user = await User.findOne({ email: email.toLowerCase() }); 
         if (user) { 
           // Link Facebook to existing account 
           user.facebookId = facebookId; 
           user.avatarUrl  = user.avatarUrl || avatarUrl; 
           user.authProvider = user.authProvider === 'local' ? 'both' : user.authProvider;
           if (email) user.isEmailVerified = true; 
           await user.save(); 
         } 
       } 
 
       if (!user) { 
         // Create new user via Facebook 
         const generatedEmail = email || 
           `fb_${facebookId}@facebook-user.orderpulse.com`; 
 
         user = await User.create({ 
           name, 
           email:           generatedEmail.toLowerCase(), 
           facebookId, 
           avatarUrl, 
           isEmailVerified: !!email, 
           isActive:        true, 
           role:            'user', 
           authProvider:    'facebook',
           password:        Math.random().toString(36) + Math.random().toString(36), 
         }); 
       } 
     } 
 
     if (!user.isActive) { 
       return done(null, false, { message: 'Account is deactivated' }); 
     } 
 
     user.lastLogin = new Date(); 
     await user.save(); 
 
     return done(null, user); 
 
   } catch (error) { 
     return done(error, false); 
   } 
 })); 
 
 // Required by Passport (even though we use JWT not sessions) 
 passport.serializeUser((user, done) => done(null, user.id)); 
 passport.deserializeUser(async (id, done) => { 
   try { 
     const user = await User.findById(id); 
     done(null, user); 
   } catch (err) { 
     done(err, null); 
   } 
 }); 
 
 module.exports = passport; 
