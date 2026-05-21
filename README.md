# Amazon Orders Management System

A Node.js backend application for managing Amazon orders with Express and MongoDB.

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
    │   └── db.js             # Database connection configuration
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
    │   ├── auth.middleware.js
    │   ├── admin.middleware.js
    │   ├── errorHandler.middleware.js
    │   ├── headOptions.middleware.js
    │   └── notFound.middleware.js
    ├── models/
    │   ├── order.model.js
    │   ├── session.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── activity.routes.js
    │   ├── admin.routes.js
    │   ├── analytics.routes.js
    │   ├── auth.routes.js
    │   ├── bulk.routes.js
    │   ├── dashboard.routes.js
    │   ├── error.routes.js
    │   ├── filter.routes.js
    │   ├── headOptions.routes.js
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
    │   ├── activity.service.js
    │   ├── admin.service.js
    │   ├── analytics.service.js
    │   ├── auth.service.js
    │   ├── bulk.service.js
    │   ├── dashboard.service.js
    │   ├── filter.service.js
    │   ├── notifications.service.js
    │   ├── order.service.js
    │   ├── pagination.service.js
    │   ├── recommendations.service.js
    │   ├── search.service.js
    │   ├── shipping.service.js
    │   ├── sort.service.js
    │   ├── stats.service.js
    │   ├── system.service.js
    │   ├── trending.service.js
    │   └── validate.service.js
    └── utils/
        ├── AppError.js           # Custom error class for operational errors
        ├── cache.js              # Shared in-memory caching utility
        └── validators.js         # Pure JS validation helper functions
```

## Folder Descriptions

### `/backend`
- **package.json** - Defines project metadata, dependencies (express, mongoose, nodemon, dotenv, jsonwebtoken, bcryptjs, nodemailer), and npm scripts
- **server.js** - Main entry point that starts the Express server
- **.env** - Environment configuration (MongoDB URI, JWT secret, email credentials)
- **src/** - Source code directory containing all application logic

### `/src`
- **app.js** - Express application setup, middleware configuration, maintenance mode check, and route integration
- **config/db.js** - MongoDB connection setup and configuration
- **controllers/** - Request handlers that process API calls and return responses
- **middlewares/** - Custom middleware for JWT authentication, admin role checks, error handling, and 404 handling
- **models/** - Mongoose schemas and models for MongoDB documents
- **routes/** - Route definitions that map HTTP methods and paths to controllers
- **services/** - Business logic separated from routes for reusability
- **utils/** - Utility classes and pure JS validation helpers (no external libraries)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
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

## Technologies Used
- **Express.js** - Web framework
- **Mongoose** - MongoDB object modeling
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variable management

## Project Architecture
This project follows the MVC (Model-View-Controller) pattern with an additional service layer for a clean, production-ready structure.

## API Documentation

### Metadata & CORS (Base URL: `/api/v1`)
The API supports standard metadata queries via `HEAD` and `OPTIONS` methods.
- **HEAD** `/(.*)` - Retrieve resource metadata and headers without the response body.
- **OPTIONS** `/(.*)` - Global CORS preflight support for all endpoints.
- **HEAD** `/orders` - Returns `X-Total-Count` and collection availability.
- **HEAD** `/orders/search` - Returns supported search fields and capabilities.

### Order Management (Base URL: `/api/v1/orders`)
- **GET** `/` - Retrieve all orders (Paginated: `?page=1&limit=10`)
- **POST** `/` - Create a new order
- **GET** `/:orderId` - Get a single order by `OrderID`
- **PUT** `/:orderId` - Full replace of an order
- **PATCH** `/:orderId` - Partial update of an order
- **DELETE** `/:orderId` - Permanent deletion of an order

### Specialized Endpoints
- **GET** `/search` - Search orders (e.g., `?q=electronics`)
- **GET** `/filter` - Filter orders (e.g., `?category=Electronics&status=Delivered`)
- **GET** `/sort` - Sort orders (e.g., `?sortBy=TotalAmount&order=desc`)
- **GET** `/:orderId/exists` - Check if an order exists
- **POST** `/:orderId/cancel` - Cancel order and update status history

### Dashboard & Analytics (Base URL: `/api/v1/dashboard` & `/api/v1/analytics`)
- **GET** `/dashboard/overview` - High-level summary of business performance
- **GET** `/dashboard/revenue` - Detailed revenue breakdown and trends
- **GET** `/dashboard/orders` - Order volume and status analytics
- **GET** `/dashboard/customers` - Customer acquisition and retention metrics
- **GET** `/analytics/products/top-selling` - Best performing products
- **GET** `/analytics/categories/top` - Category-wise revenue performance

### Recommendations & Trending (Base URL: `/api/v1/recommendations` & `/api/v1/trending`)
- **GET** `/recommendations/user/:userId` - Personalized product recommendations
- **GET** `/recommendations/frequently-bought-together` - Cross-selling suggestions
- **GET** `/trending/products` - Currently popular items based on sales velocity
- **GET** `/trending/categories` - Trending product categories

### Notifications & Activity (Base URL: `/api/v1/notifications` & `/api/v1/activity`)
- **GET** `/notifications` - Fetch user-specific alerts and updates
- **PATCH** `/notifications/:id/read` - Mark a notification as read
- **GET** `/activity/logs` - User activity history and audit logs
- **GET** `/activity/summary` - Aggregated activity metrics

### System & Admin (Base URL: `/api/v1/system` & `/api/v1/admin`)
- **GET** `/system/health` - Server health check and uptime
- **GET** `/system/stats` - Resource usage and DB performance
- **GET** `/admin/users` - Manage system users (Admin only)
- **POST** `/admin/maintenance` - Toggle maintenance mode
- **GET** `/admin/logs` - Access system-wide logs

### Shipping & Delivery (Base URL: `/api/v1/shipping`)
Logistics and tracking management.
- **GET** `/tracking/:orderId` - Track shipment with carrier and ETA
- **PATCH** `/update-status/:orderId` - Update delivery status and history
- **GET** `/pending` - List all pending shipments (Paginated)
- **GET** `/delivered` - List all delivered shipments (Paginated)
- **POST** `/create-label` - Generate shipping label data
- **GET** `/estimate/:orderId` - Detailed delivery date estimation
- **GET** `/carriers` - List supported shipping carriers
- **PATCH** `/change-address/:orderId` - Update shipping destination
- **POST** `/reschedule/:orderId` - Reschedule delivery date
