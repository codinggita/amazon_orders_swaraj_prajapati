const express  = require('express'); 
 const passport = require('../config/passport'); 
 const { 
   googleCallback, 
   facebookCallback 
 } = require('../controllers/oauth.controller'); 
 
 const router = express.Router(); 
 
 // ─── GOOGLE ROUTES ───────────────────────────────────────────── 
 // Step 1: Redirect user to Google 
 router.get('/google', 
   passport.authenticate('google', { 
     scope: ['profile', 'email'], 
     prompt: 'select_account', 
   }) 
 ); 
 
 // Step 2: Google redirects back here 
 router.get('/google/callback', 
   passport.authenticate('google', { 
     session: false, 
     failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`, 
   }), 
   googleCallback 
 ); 
 
 // ─── FACEBOOK ROUTES ─────────────────────────────────────────── 
 // Step 1: Redirect user to Facebook 
 router.get('/facebook', 
   passport.authenticate('facebook', { 
     scope: ['email', 'public_profile'], 
   }) 
 ); 
 
 // Step 2: Facebook redirects back here 
 router.get('/facebook/callback', 
   passport.authenticate('facebook', { 
     session: false, 
     failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_failed`, 
   }), 
   facebookCallback 
 ); 
 
 module.exports = router; 
