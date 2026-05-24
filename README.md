# 🩸 OrderPulse
> **The Heartbeat of Your Business** — A premium, high-performance order management, logistics tracking, and enterprise analytics suite built on the MERN stack with a unified, luxurious Crimson Dark glassmorphic design system.

---

## 🌟 Key Product Features

*   **🔒 Multi-Provider Session Auth**: Google OAuth & Facebook OAuth integrations managed via Passport.js, incorporating local storage session synchronizers to prevent redirect loops.
*   **📊 Dynamic Order Workspace**: Multi-criteria filters (payment modes, status badges, page limits), responsive list data grids, animated loader skeletons, and batch deletion controls.
*   **🚚 Real-Time Logistics Tracking**: Custom shipping carriers mapping (`BlueDart`, `FedEx`, `DHL`, `Delhivery`, etc.), automated delivery estimated metrics, and vertical shipping status progress steppers.
*   **📈 Beautiful Analytical Graphs**: Custom responsive charts (Area, Bar, Line, Donut, Pie) featuring interactive hovering tooltips formatted to Indian Rupees (INR).
*   **🍩 Premium Stats Donut Grid**: Custom-segmented donut ratio charts with centered processing counts and static HTML legend grids replacing cramped SVG legends.
*   **📤 Bulk Upload System**: High-volume drag-and-drop CSV/JSON upload parser equipped with automated verification logs.
*   **🔔 Real-Time Notifications**: Tray panel alert feeds and notifications archive portal with severity filters (Success, Info, Warning).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Redux Toolkit, React Router v7, Tailwind CSS v4, Material UI v9, Recharts |
| **Backend** | Node.js, Express, Passport.js (OAuth2.0), JWT Session Auth |
| **Database** | MongoDB (Mongoose Object Mapping) |
| **Styling** | Vanilla CSS, Glassmorphic Backdrop Blurs, Modern Fonts (`Plus Jakarta Sans`, `Outfit`, `Inter`) |

---

## 📂 Project Directory Structure

### 💻 Frontend Architecture (`/Frontend`)
```bash
Frontend/
├── src/
│   ├── api/                  # Axios HTTP client configurations & endpoint services
│   ├── assets/               # Images and public static graphics assets
│   ├── config/               # Material UI customized theme styles
│   ├── context/              # Authentication context & unified dark crimson lock
│   ├── hooks/                # Stateful functional hooks
│   ├── store/                # Central Redux store, auth, orders, and analytical slices
│   ├── components/
│   │   ├── common/           # Atomic UI (Frosted Cards, Modals, Spinners, ErrorBoundary)
│   │   ├── layout/           # Frame structures (Sidebar navigation, Top Navbar, Auth Layout)
│   │   └── features/         # Specialized features (Order tables, filter controls)
│   ├── pages/
│   │   ├── auth/             # LoginPage, RegisterPage, OAuthCallback redirects
│   │   ├── dashboard/        # Operational dashboard cockpit
│   │   ├── stats/            # Charts displays & HTML legend donut grid
│   │   ├── shipping/         # Logistics steppers & tracking status pages
│   │   └── bulk/             # CSV drag-and-drop parser uploaders
│   ├── utils/                # Number formatters, date compilers, breadcrumbs splits
│   ├── index.css             # Unified Crimson Dark design token specifications
│   └── App.jsx               # Suspense page routing branches
```

### 🛢️ Backend Architecture (`/Backend`)
```bash
Backend/
├── src/
│   ├── config/               # Passport OAuth, sessions, and Mongoose database bindings
│   ├── controllers/          # Orders, stats, and notification endpoints triggers
│   ├── middlewares/          # JWT authorization verifiers, CORS logs, and exceptions
│   ├── models/               # MongoDB schema models (User, Order, Notifications)
│   ├── routes/               # API Router endpoints
│   ├── services/             # Core business databases data-access service layer
│   ├── utils/                # Token generators, timestamps, and error responses
│   └── app.js                # Express app initialization & server setups
```

---

## 🚀 Setting Up the Project Locally

### 1️⃣ Clone the Repository from GitHub
Clone the repository to your local system:
```bash
git clone https://github.com/SwarajPrajapati2006/amazon_orders_swaraj_prajapati.git
cd amazon_orders_swaraj_prajapati
```

---

### 2️⃣ Configure the Backend Service

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template file:
   ```bash
   cp .env.example .env
   ```
4. Edit the newly created `.env` file with your details:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/orderpulse
   FRONTEND_URL=http://localhost:5173
   
   # Social authentication IDs
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
   
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback
   
   # Token secrets
   JWT_ACCESS_SECRET=your_jwt_access_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   ```

---

### 3️⃣ Configure the Frontend Application

1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   ```bash
   cp .env.example .env
   ```
4. Define the API endpoint inside `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

---

### 4️⃣ Set Up Google Cloud OAuth Consent
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **OrderPulse**.
3. Under **OAuth consent screen**, set User Type to External, and add the scopes `email`, `profile`, and `openid`.
4. Go to **Credentials**, click **Create Credentials → OAuth Client ID** (Web application type).
   *   **Authorized JavaScript origins**: `http://localhost:5173`
   *   **Authorized redirect URIs**: `http://localhost:5000/api/v1/auth/google/callback`
5. Paste the generated client credentials into your backend `.env` variables (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`).

---

### 5️⃣ Boot Up both Environments

#### Run the Backend Server
```bash
# Terminal 1 — Start the API backend
cd Backend
npm run dev
```
*The server will boot up and bind to `http://localhost:5000`.*

#### Run the Frontend Dev Server
```bash
# Terminal 2 — Start the React dev client
cd Frontend
npm run dev
```
*Vite will compile files and open the portal on `http://localhost:5173`.*

---

## 🏗️ Production Build and Deployment

To compile the application bundle for production:
```bash
cd Frontend
npm run build
```
Vite will compile and package the assets into `/Frontend/dist/` with optimized chunk splits, prepared for direct deployment on static web servers (Vercel, Netlify, AWS S3).

---

## 🔒 Security Best Practices
- Never check custom secrets or `.env` files into public Git repositories.
- Keep the `JWT_ACCESS_SECRET` keys highly secure on servers.
- Use HTTPS paths exclusively for all production callback redirections.
