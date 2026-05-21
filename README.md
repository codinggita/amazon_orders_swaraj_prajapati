# Amazon Orders Management System

A production-ready Node.js + Express + MongoDB REST API for managing Amazon orders, featuring advanced analytics, real-time dashboards, AI-powered recommendations, and full HTTP method coverage (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS).

---

## 🚀 Postman API Documentation

A comprehensive, production-grade Postman collection containing all ~100 API endpoints has been compiled and is included in this repository.

### Postman Collection File:
* [`amazon_orders_postman_collection.json`](./amazon_orders_postman_collection.json) at the root of the project.

### Premium Built-in Features:
* **Dynamic Variable Config:** Features a pre-configured `baseUrl` set to your live Render service (`https://amazon-orders-api.onrender.com`) and supports dynamic `{{token}}` headers.
* **Automated JWT Extraction:** The **Login User** request has a pre-configured test script that extracts the JWT response token and updates the environment's `{{token}}` variable automatically upon a successful response. No more manual copy-pasting of tokens!
* **15 Feature-Driven Folders:** Logically grouped into Auth, CRUD, Bulk, Advanced Searches, Analytics, Real-time Stats, Admin Control, simulated Errors, Validation, Recommendations, and more.

### How to Import & Use:
1. Open the Postman desktop application or Postman Web.
2. Click **Import** in the top-left sidebar.
3. Drag & drop the `amazon_orders_postman_collection.json` file from your project's root folder.
4. Click **Import**.
5. *Optional:* To run tests locally, click the collection name, go to the **Variables** tab, and change the `baseUrl` value to `http://localhost:3000`.

---


## Backend Folder Structure

```
backend/
├── .env                      # Environment variables (JWT, DB, Email config)
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
├── server.js                 # Application entry point
└── src/
    ├── app.js                # Express app configuration & route mounting
    ├── config/
    │   └── db.js             # MongoDB connection configuration
    ├── controllers/
    │   ├── activity.controller.js
    │   ├── admin.controller.js
    │   ├── analytics.controller.js
    │   ├── auth.controller.js
    │   ├── bulk.controller.js
    │   ├── dashboard.controller.js
    │   ├── error.controller.js
    │   ├── filter.controller.js
    │   ├── notifications.controller.js
    │   ├── order.controller.js
    │   ├── pagination.controller.js
    │   ├── recommendations.controller.js
    │   ├── search.controller.js
    │   ├── shipping.controller.js
    │   ├── sort.controller.js
    │   ├── stats.controller.js
    │   ├── system.controller.js
    │   ├── trending.controller.js
    │   └── validate.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js          # JWT protect + isAdmin guards
    │   ├── errorHandler.middleware.js  # Global error handler
    │   ├── headOptions.middleware.js   # Reusable HEAD/OPTIONS header helpers
    │   ├── notFound.middleware.js      # 404 fallback
    │   └── rateLimit.middleware.js     # Rate limiting
    ├── models/
    │   ├── order.model.js    # amazonOrders collection schema
    │   ├── session.model.js  # User session schema
    │   └── user.model.js     # Users collection schema
    ├── routes/
    │   ├── activity.routes.js
    │   ├── admin.routes.js
    │   ├── analytics.routes.js
    │   ├── auth.routes.js
    │   ├── bulk.routes.js
    │   ├── dashboard.routes.js
    │   ├── error.routes.js
    │   ├── filter.routes.js
    │   ├── headOptions.routes.js   # All HEAD + OPTIONS routes
    │   ├── notifications.routes.js
    │   ├── order.routes.js
    │   ├── pagination.routes.js
    │   ├── recommendations.routes.js
    │   ├── search.routes.js
    │   ├── shipping.routes.js
    │   ├── sort.routes.js
    │   ├── stats.routes.js
    │   ├── system.routes.js
    │   ├── trending.routes.js
    │   └── validate.routes.js
    ├── services/
    │   ├── activity.service.js        # In-memory activity log store
    │   ├── admin.service.js
    │   ├── analytics.service.js
    │   ├── auth.service.js
    │   ├── bulk.service.js
    │   ├── dashboard.service.js       # 5 dashboard aggregation views
    │   ├── filter.service.js
    │   ├── notifications.service.js   # In-memory notifications store
    │   ├── order.service.js
    │   ├── pagination.service.js
    │   ├── recommendations.service.js # Customer + order-based recommendations
    │   ├── search.service.js
    │   ├── shipping.service.js
    │   ├── sort.service.js
    │   ├── stats.service.js
    │   ├── system.service.js          # Version, config, uptime, health checks
    │   ├── trending.service.js        # Product + category trend aggregations
    │   └── validate.service.js
    └── utils/
        ├── AppError.js    # Custom error class for operational errors
        ├── cache.js       # Shared in-memory Map (used by admin + system)
        └── validators.js  # Pure JS validation helpers
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (Atlas or local)

### Installation

```bash
cd Backend
npm install
```

### Environment Variables
Create a `.env` file in the `Backend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Running the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

---

## Technologies Used

| Technology | Purpose |
|---|---|
| **Express.js 5** | Web framework |
| **Mongoose** | MongoDB object modeling |
| **MongoDB** | Primary database (amazonOrders + users collections) |
| **jsonwebtoken** | JWT authentication |
| **bcryptjs** | Password hashing |
| **nodemailer** | Email delivery (OTP, verification) |
| **dotenv / dotenvx** | Environment variable management |
| **Nodemon** | Development auto-reload |

---

## Project Architecture

This project follows a clean **Routes → Controller → Service** layered architecture:

```
Request → Routes (auth middleware) → Controller (validates, formats) → Service (DB/business logic) → Response
```

- **Routes** – map HTTP method + path to controller, apply auth guards
- **Controllers** – thin layer; calls service, formats response
- **Services** – all database queries and business logic
- **Utils** – shared helpers (AppError, cache, validators)

---

## API Documentation

### Base URL: `http://localhost:3000/api/v1`

> **Auth note:** All routes marked `🔒` require `Authorization: Bearer <token>` header.  
> Admin routes additionally require the user to have `role: "admin"`.

---

### 🏠 Order Management — `/api/v1/orders`

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all orders (paginated: `?page=1&limit=10`) |
| POST | `/` | Create a new order |
| GET | `/:orderId` | Get single order by `OrderID` |
| PUT | `/:orderId` | Full replace of an order |
| PATCH | `/:orderId` | Partial update of an order |
| DELETE | `/:orderId` | Delete an order |
| GET | `/:orderId/exists` | Check if order exists |
| POST | `/:orderId/cancel` | Cancel order and update status history |

---

### 🔍 Search, Filter & Sort — `/api/v1/orders`

| Method | Path | Description |
|---|---|---|
| GET | `/search?q=electronics` | Full-text search across all fields |
| GET | `/filter?category=Electronics&status=Delivered` | Multi-field filtering |
| GET | `/sort?sortBy=TotalAmount&order=desc` | Sorted order listing |

---

### 📦 Bulk Operations — `/api/v1/orders/bulk` 🔒

| Method | Path | Description |
|---|---|---|
| POST | `/status-update` | Bulk update order status |
| POST | `/delete` | Bulk delete orders |
| GET | `/export` | Export filtered orders |

---

### 📈 Analytics — `/api/v1/analytics` 🔒

| Method | Path | Description |
|---|---|---|
| GET | `/revenue/total` | Total revenue aggregation |
| GET | `/revenue/by-month` | Monthly revenue breakdown |
| GET | `/products/top-selling` | Best-performing products |
| GET | `/categories/top` | Category-wise revenue |
| GET | `/customers/top` | Top customers by spend |

---

### 📊 Stats — `/api/v1/stats` 🔒

| Method | Path | Description |
|---|---|---|
| GET | `/orders/total` | Total order count |
| GET | `/orders/by-status` | Orders grouped by status |
| GET | `/revenue/summary` | Revenue summary stats |

---

### 🚚 Shipping — `/api/v1/shipping` 🔒

| Method | Path | Description |
|---|---|---|
| GET | `/tracking/:orderId` | Track shipment with carrier + ETA |
| PATCH | `/update-status/:orderId` | Update delivery status |
| GET | `/pending` | List pending shipments |
| GET | `/delivered` | List delivered shipments |
| POST | `/create-label` | Generate shipping label |
| GET | `/estimate/:orderId` | Delivery date estimation |
| GET | `/carriers` | List supported carriers |
| PATCH | `/change-address/:orderId` | Update shipping address |
| POST | `/reschedule/:orderId` | Reschedule delivery |

---

### 🔐 Authentication — `/api/v1/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login and receive JWT tokens |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Logout and invalidate session |
| GET | `/profile` 🔒 | Get current user profile |
| POST | `/forgot-password` | Request password reset email |
| POST | `/reset-password` | Reset password with token |
| POST | `/verify-email` | Verify email with OTP |
| POST | `/resend-otp` | Resend email OTP |

---

### 🛡️ Admin — `/api/v1/admin` 🔒 (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/users` | List all users with filters |
| GET | `/users/:id` | Get user details |
| PATCH | `/users/:id/ban` | Ban a user |
| PATCH | `/users/:id/unban` | Unban a user |
| PATCH | `/users/:id/role` | Change user role |
| GET | `/orders` | Admin orders list |
| GET | `/reports/sales` | Full sales report |
| GET | `/reports/revenue` | Revenue report |
| DELETE | `/cache/clear` | Clear application cache |
| GET | `/system/health` | System health overview |
| GET | `/system/logs` | Server logs |
| POST | `/system/maintenance` | Toggle maintenance mode |
| GET | `/backups` | List database backups |

---

### 🤖 Recommendations — `/api/v1/recommendations` 🔒 (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/products/:customerId` | Product recommendations based on customer history |
| GET | `/orders/:orderId` | Similar products based on a specific order |

---

### 🔥 Trending — `/api/v1/trending` 🔒 (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/products?limit=10&category=Electronics` | Trending products by order frequency |
| GET | `/categories?limit=10` | Trending categories with growth indicators |

---

### 🔔 Notifications — `/api/v1/notifications` 🔒 (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/?isRead=false&type=order&priority=high` | List notifications with filters |
| PATCH | `/read/:id` | Mark notification as read |
| DELETE | `/:id` | Delete a notification |

---

### 📝 Activity Logs — `/api/v1/activity` 🔒 (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/logs?action=ORDER_CREATED&entity=Order&search=vihaan` | Fetch activity logs with filters |

---

### 📉 Dashboard — `/api/v1/dashboard` 🔒 (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/overview` | KPIs: orders, revenue, customers, users |
| GET | `/revenue` | Revenue trends, payment methods, best month |
| GET | `/orders` | Order volume, status breakdown, top cities |
| GET | `/customers` | Customer acquisition, repeat rate, top spenders |
| GET | `/products` | Top selling, top revenue, low sellers, discounts |

---

### ⚙️ System — `/api/v1/system`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/ping` | Public | Liveness check |
| GET | `/version` | 🔒 Admin | API version and build info |
| GET | `/config` | 🔒 Admin | Public configuration (no secrets) |
| GET | `/uptime` | 🔒 Admin | Server uptime and memory usage |
| GET | `/status/database` | 🔒 Admin | MongoDB connection health + latency |
| GET | `/status/cache` | 🔒 Admin | In-memory cache stats |
| GET | `/status/storage` | 🔒 Admin | Storage bucket usage |

---

### ✅ Validation — `/api/v1/validate`

| Method | Path | Description |
|---|---|---|
| POST | `/order` | Validate order payload (pure JS, no libraries) |
| POST | `/user` | Validate user payload |

---

### 🌐 HEAD Routes — `/api/v1` (Resource Metadata, No Auth Required)

HEAD requests return **only headers, no response body**. Use them to check resource availability, counts, and capabilities without downloading full responses.

| Method | Path | Key Response Headers |
|---|---|---|
| HEAD | `/orders` | `X-Total-Count`, `X-Collection`, `X-Status` |
| HEAD | `/orders/:orderId` | `X-Resource-Exists`, `X-Order-Status`, `X-Order-Total` |
| HEAD | `/orders/:orderId/items` | `X-Resource-Exists`, `X-Product-ID`, `X-Quantity` |
| HEAD | `/orders/search` | `X-Search-Fields`, `X-Fuzzy-Search`, `X-Autocomplete` |
| HEAD | `/orders/filter/delivered` | `X-Total-Count`, `X-Filter` |
| HEAD | `/shipping/pending` | `X-Total-Count`, `X-Shipping-Type` |
| HEAD | `/shipping/tracking/:orderId` | `X-Tracking-Available`, `X-Carrier`, `X-Tracking-ID` |
| HEAD | `/analytics/revenue/total` | `X-Total-Revenue`, `X-Currency` |
| HEAD | `/stats/orders/total` | `X-Total-Orders` |
| HEAD | `/admin/users` | `X-Total-Users`, `X-Active-Users`, `X-Admin-Users` |
| HEAD | `/admin/orders` | `X-Total-Orders` |
| HEAD | `/dashboard/overview` | `X-Total-Orders`, `X-Total-Customers` |
| HEAD | `/system/ping` | `X-Ping: pong`, `X-Status: alive` |
| HEAD | `/system/uptime` | `X-Uptime-Seconds`, `X-Node-Version` |
| HEAD | `/system/status/database` | `X-DB-Status`, `X-Is-Healthy` |
| HEAD | `/system/status/cache` | `X-Cache-Size`, `X-Cache-Type` |
| HEAD | `/system/status/storage` | `X-Storage-Used-MB`, `X-Storage-Usage-Pct` |
| HEAD | `/auth/profile` | `X-Requires-Auth`, `X-Auth-Type` |
| HEAD | `/notifications` | `X-Filter-Fields`, `X-Notification-Type` |
| HEAD | `/activity/logs` | `X-Max-Logs`, `X-Filter-Fields` |

**Standard headers on every HEAD response:**
```
X-API-Version: 1.0.0
X-Powered-By: Amazon Orders API
X-Request-ID: <timestamp>
X-Timestamp: <ISO date>
Cache-Control: no-cache, no-store, must-revalidate
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
```

---

### 🔀 OPTIONS Routes — `/api/v1` (CORS Preflight + Route Discovery)

OPTIONS requests return `204 No Content` with `Allow` and CORS headers. Browsers use these automatically for CORS preflight. Clients can also call them manually to discover what methods a route supports.

| Method | Path | Allowed Methods |
|---|---|---|
| OPTIONS | `/orders` | `GET, POST, HEAD, OPTIONS` |
| OPTIONS | `/orders/:orderId` | `GET, PUT, PATCH, DELETE, HEAD, OPTIONS` |
| OPTIONS | `/orders/search` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/orders/filter/status` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/shipping/tracking/:orderId` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/shipping/create-label` | `POST, OPTIONS` |
| OPTIONS | `/auth/login` | `POST, OPTIONS` |
| OPTIONS | `/auth/register` | `POST, OPTIONS` |
| OPTIONS | `/admin/users` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/admin/orders` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/admin/system/health` | `GET, OPTIONS` |
| OPTIONS | `/analytics/revenue/total` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/dashboard/overview` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/notifications` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/system/version` | `GET, OPTIONS` |
| OPTIONS | `/system/status/database` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/system/status/cache` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/system/status/storage` | `GET, HEAD, OPTIONS` |
| OPTIONS | `/validate/order` | `POST, OPTIONS` |
| OPTIONS | `/errors/not-found` | `GET, OPTIONS` |

**Standard headers on every OPTIONS response:**
```
Allow: <route-specific methods>
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: <route-specific methods>
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept
Access-Control-Max-Age: 86400
X-API-Version: 1.0.0
X-Resource-Description: <route description>
```

---

## In-Memory Stores

Two module-level stores persist across requests during a server session (equivalent to Redis in production):

| Store | Location | Contents |
|---|---|---|
| `notificationsStore` | `notifications.service.js` | 5 seeded notifications (order, payment, shipping, system, alert) |
| `activityLogs` | `activity.service.js` | 8 seeded activity events (ORDER_CREATED, USER_LOGIN, ORDER_SHIPPED, etc.) |
| `appCache` | `utils/cache.js` | Shared Map used by admin and system services |

---

## Error Responses

All errors follow a uniform format:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "technical error detail (dev mode only)"
}
```

Common status codes:
- `400` Bad Request — invalid input
- `401` Unauthorized — missing or invalid JWT
- `403` Forbidden — authenticated but insufficient role
- `404` Not Found — resource doesn't exist
- `503` Service Unavailable — maintenance mode or DB disconnected
