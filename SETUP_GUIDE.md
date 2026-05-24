# OrderPulse — Google & Facebook OAuth Setup Guide

Free OAuth using Passport.js on the backend. Frontend redirects to Express; callbacks return JWT tokens.

## Prerequisites

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- MongoDB running
- Packages installed: `passport`, `passport-google-oauth20`, `passport-facebook` (backend)

---

## 1. Backend environment variables

Copy `Backend/.env.example` to `Backend/.env` and fill in:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback

JWT_ACCESS_SECRET=your_strong_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

## 2. Frontend environment variables

Copy `Frontend/.env.example` to `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Use the **full backend URL** for OAuth (not the Vite proxy). Email/password API calls can use `/api/v1` via proxy or the same URL.

---

## 3. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project **OrderPulse**
3. **APIs & Services → OAuth consent screen**
   - User type: External (or Internal for workspace)
   - App name: **OrderPulse**
   - Support email: your email
   - Scopes: `email`, `profile`, `openid`
4. **Credentials → Create credentials → OAuth 2.0 Client ID**
   - Type: **Web application**
   - Name: OrderPulse Web
   - **Authorized JavaScript origins:** `http://localhost:5173`
   - **Authorized redirect URIs:** `http://localhost:5000/api/v1/auth/google/callback`
5. Copy **Client ID** → `GOOGLE_CLIENT_ID`
6. Copy **Client secret** → `GOOGLE_CLIENT_SECRET`

---

## 4. Facebook Developers

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. **My Apps → Create App → Consumer**
3. App name: **OrderPulse**
4. Add product: **Facebook Login**
5. **Facebook Login → Settings**
   - Valid OAuth Redirect URIs:
     `http://localhost:5000/api/v1/auth/facebook/callback`
6. **Settings → Basic**
   - Copy **App ID** → `FACEBOOK_APP_ID`
   - Copy **App Secret** → `FACEBOOK_APP_SECRET`
7. Development mode: add your Facebook account under **Roles → Test users** or use your admin account

---

## 5. Run the app

```bash
# Terminal 1 — Backend
cd Backend
npm run dev

# Terminal 2 — Frontend
cd Frontend
npm run dev
```

Open `http://localhost:5173/login` and use **Continue with Google** or **Continue with Facebook**.

---

## 6. OAuth flow

1. User clicks social button → `GET http://localhost:5000/api/v1/auth/google` (or `/facebook`)
2. Passport redirects to provider login
3. Provider redirects to `/api/v1/auth/google/callback`
4. Backend creates/links user, issues JWT
5. Redirect to `http://localhost:5173/auth/callback?token=...&user=...`
6. `OAuthCallbackPage` saves token to `localStorage` and goes to `/dashboard`

---

## 7. Troubleshooting

| Issue | Fix |
|--------|-----|
| `redirect_uri_mismatch` | Redirect URI must match **exactly** in Google/Facebook console |
| OAuth button does nothing | Check `VITE_API_URL` points to port **5000** |
| `Authentication failed` | Verify `JWT_ACCESS_SECRET` and MongoDB connection |
| Facebook no email | App may use generated email; enable `email` permission |
| CORS errors on API | Backend allows `*`; use proxy or full API URL consistently |

---

## 8. Production

- Update `FRONTEND_URL`, callback URLs, and authorized origins to your production domain
- Use HTTPS for all redirect URIs
- Store secrets only in server environment variables, never in the frontend repo
