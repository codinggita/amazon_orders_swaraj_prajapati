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
    │   ├── order.controller.js
    │   ├── search.controller.js
    │   ├── filter.controller.js
    │   ├── pagination.controller.js
    │   ├── sort.controller.js
    │   ├── analytics.controller.js
    │   ├── stats.controller.js
    │   ├── shipping.controller.js
    │   ├── auth.controller.js
    │   ├── admin.controller.js
    │   ├── bulk.controller.js
    │   ├── error.controller.js
    │   └── validate.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── admin.middleware.js
    │   ├── errorHandler.middleware.js
    │   └── notFound.middleware.js
    ├── models/
    │   ├── order.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── order.routes.js
    │   ├── search.routes.js
    │   ├── filter.routes.js
    │   ├── pagination.routes.js
    │   ├── sort.routes.js
    │   ├── analytics.routes.js
    │   ├── stats.routes.js
    │   ├── shipping.routes.js
    │   ├── auth.routes.js
    │   ├── admin.routes.js
    │   ├── bulk.routes.js
    │   ├── error.routes.js
    │   └── validate.routes.js
    ├── services/
    │   ├── order.service.js
    │   ├── search.service.js
    │   ├── filter.service.js
    │   ├── pagination.service.js
    │   ├── sort.service.js
    │   ├── analytics.service.js
    │   ├── stats.service.js
    │   ├── shipping.service.js
    │   ├── auth.service.js
    │   ├── admin.service.js
    │   ├── bulk.service.js
    │   ├── error.service.js
    │   └── validate.service.js
    └── utils/
        ├── AppError.js           # Custom error class for operational errors
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

### Analytics (Base URL: `/api/v1/analytics`)
Comprehensive business intelligence metrics using MongoDB aggregation.
- **GET** `/revenue/total` - Overall revenue metrics
- **GET** `/revenue/monthly` - Revenue trend by month
- **GET** `/orders/cancelled` - Cancellation rate and lost revenue
- **GET** `/products/top-selling` - Best performing products
- **GET** `/categories/top` - Category-wise revenue performance
- **GET** `/returns/rate` - Overall return rate analytics

### Statistics (Base URL: `/api/v1/stats`)
Real-time statistical breakdown and system health.
- **GET** `/orders/total` - Order count by status and percentages
- **GET** `/orders/daily` - Daily order volume with date filtering
- **GET** `/revenue/total` - Detailed revenue, tax, and discount breakdown
- **GET** `/revenue/monthly` - Monthly revenue with growth trend (MoM %)
- **GET** `/customers/count` - Unique customers, new vs repeat metrics
- **GET** `/system/performance` - Server uptime, memory usage, and DB status

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

