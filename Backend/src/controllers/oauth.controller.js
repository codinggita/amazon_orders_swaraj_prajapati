const jwt  = require('jsonwebtoken'); 
 
 const generateTokens = (user) => { 
   const accessToken = jwt.sign( 
     { id: user._id, role: user.role, email: user.email }, 
     process.env.JWT_ACCESS_SECRET, 
     { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' } 
   ); 
   const refreshToken = jwt.sign( 
     { id: user._id }, 
     process.env.JWT_REFRESH_SECRET, 
     { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' } 
   ); 
   return { accessToken, refreshToken }; 
 }; 
 
 // Called after successful Google OAuth 
 const googleCallback = async (req, res) => { 
   try { 
     if (!req.user) { 
       return res.redirect( 
         `${process.env.FRONTEND_URL}/login?error=Google authentication failed` 
       ); 
     } 
 
     const { accessToken, refreshToken } = generateTokens(req.user); 
 
     // Save refresh token to user 
     req.user.refreshToken = refreshToken; 
     await req.user.save(); 
 
     // Build user data for frontend 
    const userData = {
      id:              String(req.user._id),
      name:            req.user.name,
      email:           req.user.email,
      role:            req.user.role,
      isEmailVerified: req.user.isEmailVerified,
      avatarUrl:       req.user.avatarUrl,
      googleId:        req.user.googleId,
      authProvider:    req.user.authProvider || 'google',
    };

    const params = new URLSearchParams({
      token:        accessToken,
      refreshToken: refreshToken,
      user:         encodeURIComponent(JSON.stringify(userData)),
      provider:     'google',
    });
 
     res.redirect( 
       `${process.env.FRONTEND_URL}/auth/callback?${params.toString()}` 
     ); 
 
   } catch (error) { 
     console.error('Google callback error:', error); 
     res.redirect( 
       `${process.env.FRONTEND_URL}/login?error=Authentication failed` 
     ); 
   } 
 }; 
 
 // Called after successful Facebook OAuth 
 const facebookCallback = async (req, res) => { 
   try { 
     if (!req.user) { 
       return res.redirect( 
         `${process.env.FRONTEND_URL}/login?error=Facebook authentication failed` 
       ); 
     } 
 
     const { accessToken, refreshToken } = generateTokens(req.user); 
 
     req.user.refreshToken = refreshToken; 
     await req.user.save(); 
 
    const userData = {
      id:              String(req.user._id),
      name:            req.user.name,
      email:           req.user.email,
      role:            req.user.role,
      isEmailVerified: req.user.isEmailVerified,
      avatarUrl:       req.user.avatarUrl,
      facebookId:      req.user.facebookId,
      authProvider:    req.user.authProvider || 'facebook',
    };

    const params = new URLSearchParams({
      token:        accessToken,
      refreshToken: refreshToken,
      user:         encodeURIComponent(JSON.stringify(userData)),
      provider:     'facebook',
    });
 
     res.redirect( 
       `${process.env.FRONTEND_URL}/auth/callback?${params.toString()}` 
     ); 
 
   } catch (error) { 
     console.error('Facebook callback error:', error); 
     res.redirect( 
       `${process.env.FRONTEND_URL}/login?error=Authentication failed` 
     ); 
   } 
 }; 
 
 module.exports = { googleCallback, facebookCallback }; 
