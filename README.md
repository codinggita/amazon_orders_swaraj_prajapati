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

## 📈 SEO, Performance & Accessibility Optimizations

OrderPulse is fully optimized for production search indexing, maximum load speeds, and strict W3C web accessibility guidelines.

### 🚀 Google PageSpeed Insights Results
The optimized frontend achieves **elite tier** performance scores across all audits:
- ⚡ **Performance**: **99/100** (First Contentful Paint: **0.4s**, Speed Index: **0.4s**, Total Blocking Time: **0ms**)
- 🎨 **Best Practices**: **100/100** (Strict security policies and standardized code quality)
- 📊 **SEO**: **92/100** (Complete index configurations and search previews)
- ♿ **Accessibility**: **85+/100** (Comprehensive screen reader support and keyboard-friendly focus flows)

### 🔍 Core SEO Architecture
1. **Dynamic Metadata Hydration (`react-helmet-async`)**: Setup a unified `<SEO />` component dynamically injecting unique page titles, custom meta descriptions, search queries, and localized tags.
2. **Social Media Cards (Open Graph & Twitter)**: Set absolute social asset mappings (`og:image`, `og:title`, `og:description`, `twitter:card: summary_large_image`) for premium presentation on LinkedIn, X, Slack, and Facebook.
3. **Structured Schema Data (JSON-LD)**: Injected semantic schemas (`WebApplication` for root index, `WebPage` for core dashboards, and `BreadcrumbList` navigation graphs) to help Google extract rich query details and structured snippets.
4. **Site XML Mapping (`sitemap.xml`)**: Established a full XML index mapping 12 production routes alongside exact priorities and change ratios (daily, weekly, monthly).
5. **Search Crawler Rules (`robots.txt`)**: Set explicit instructions for web search engines permitting public dashboard indexing while strictly blocking private, operational, and admin routes.
6. **Domain Verification**: Integrated Google Search Console validation directly into the root HTML header template.

### 📦 Code-Splitting & Build Engine (Vite v8 + Rolldown)
Configured functional code-splitting inside [vite.config.js](file:///c:/Users/Swaraj/OneDrive/Desktop/SummerAssign2/amazon_orders_swaraj_prajapati/Frontend/vite.config.js) using:
```javascript
manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('react-dom')) return 'vendor';
    if (id.includes('recharts')) return 'charts';
    if (id.includes('@mui')) return 'mui';
    if (id.includes('formik')) return 'forms';
    return 'vendor_other';
  }
}
```
This isolates framework-heavy engines into dedicated cached bundles, preventing main thread blocking and yielding a **0ms Total Blocking Time (TBT)**!

### ♿ Accessibility (a11y) & Usability
- **ARIA Landmark Attributes**: Integrated accessible landmarks, page regions, and semantic layout tags.
- **Accessible Interaction Controls**: Injected descriptive `aria-label` tags into all icon-only control toggles (User profile toggle buttons, sidebar expand/collapse switches, notifications checkmarks, and sign-out controls) and form inputs.
- **Visual Micro-Animations**: Used premium glassmorphism blur layers and soft slide-ups without introducing layout shift (CLS: 0).

---

## 🏗️ Production Build and Deployment

To compile the application bundle for production:
```bash
cd Frontend
npm run build
```
Vite will compile and package the assets into `/Frontend/dist/` with optimized chunk splits, prepared for direct deployment on static web servers (Vercel, Netlify, AWS S3).

### ⚡ Vercel Edge Server Optimizations (`vercel.json`)
The production frontend uses `vercel.json` to configure edge delivery:
- **SPA Rewrite Router**: Maps all virtual React Router endpoints securely to `index.html`.
- **Advanced HTTP Cache Controls**: Sets `Cache-Control: public, max-age=31536000, immutable` for assets under `/assets/` and `max-age=86400` (1 day) for manifests, sitemaps, and robots configurations.
- **Strict Edge Security Headers**:
  - `X-Content-Type-Options: nosniff` (Prevent MIME-type sniffing attacks)
  - `X-Frame-Options: DENY` (Mitigate clickjacking vulnerabilities)
  - `X-XSS-Protection: 1; mode=block` (Enable native browser XSS protection filters)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (Deactivates camera, microphone, and geolocation API accesses)

---

## 🔒 Security Best Practices
- Never check custom secrets or `.env` files into public Git repositories.
- Keep the `JWT_ACCESS_SECRET` keys highly secure on servers.
- Use HTTPS paths exclusively for all production callback redirections.
