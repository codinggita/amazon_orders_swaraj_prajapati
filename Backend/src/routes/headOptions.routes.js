// src/routes/headOptions.routes.js
//
// Implements ALL HEAD and OPTIONS routes for the Amazon Orders API.
// Mount this router at /api/v1 in app.js so all paths resolve correctly.
//
// HEAD    → returns only response headers, NO body (res.status(code).end())
// OPTIONS → returns allowed methods + CORS info, NO body (res.status(204).end())

const express  = require("express");
const router   = express.Router();
const mongoose = require("mongoose");
const Order    = require("../models/order.model");
const User     = require("../models/user.model");
const appCache = require("../utils/cache");
const {
  setStandardHeadHeaders,
  setStandardOptionsHeaders
} = require("../middlewares/headOptions.middleware");

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                          HEAD ROUTES                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/orders
// Check orders collection metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/orders", async (req, res, next) => {
  try {
    const total = await Order.countDocuments({});
    setStandardHeadHeaders(res, {
      "X-Total-Count": total.toString(),
      "X-Resource":    "orders",
      "X-Collection":  "amazonOrders",
      "X-Status":      "available"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/orders/search
// Return metadata about search capability
// NOTE: Must be defined BEFORE /orders/:orderId to avoid param capture
// ──────────────────────────────────────────────────────────────────────────────
router.head("/orders/search", (req, res, next) => {
  try {
    setStandardHeadHeaders(res, {
      "X-Search-Enabled": "true",
      "X-Search-Fields":  "OrderID,CustomerName,ProductName,Category,Brand,OrderStatus,PaymentMethod,City,State,Country",
      "X-Fuzzy-Search":   "true",
      "X-Autocomplete":   "true",
      "X-Resource":       "search"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/orders/filter/delivered
// Count delivered orders
// NOTE: Must be defined BEFORE /orders/:orderId to avoid param capture
// ──────────────────────────────────────────────────────────────────────────────
router.head("/orders/filter/delivered", async (req, res, next) => {
  try {
    const total = await Order.countDocuments({ OrderStatus: /^delivered$/i });
    setStandardHeadHeaders(res, {
      "X-Total-Count": total.toString(),
      "X-Filter":      "status=Delivered",
      "X-Resource":    "filtered-orders"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/orders/:orderId
// Check if a specific order exists
// ──────────────────────────────────────────────────────────────────────────────
router.head("/orders/:orderId", async (req, res, next) => {
  try {
    const order = await Order.findOne({ OrderID: req.params.orderId })
      .select("OrderID OrderStatus TotalAmount OrderDate")
      .lean();

    if (!order) {
      setStandardHeadHeaders(res, { "X-Resource-Exists": "false" });
      return res.status(404).end();
    }

    setStandardHeadHeaders(res, {
      "X-Resource-Exists": "true",
      "X-Order-Status":    order.OrderStatus,
      "X-Order-Total":     order.TotalAmount,
      "X-Order-Date":      order.OrderDate,
      "X-Resource":        "order"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/orders/:orderId/items
// Check if order items exist for this order
// ──────────────────────────────────────────────────────────────────────────────
router.head("/orders/:orderId/items", async (req, res, next) => {
  try {
    const order = await Order.findOne({ OrderID: req.params.orderId })
      .select("ProductID ProductName Quantity")
      .lean();

    if (!order) {
      setStandardHeadHeaders(res, { "X-Resource-Exists": "false" });
      return res.status(404).end();
    }

    setStandardHeadHeaders(res, {
      "X-Resource-Exists": "true",
      "X-Product-ID":      order.ProductID,
      "X-Quantity":        order.Quantity,
      "X-Resource":        "order-items"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/shipping/pending
// Count pending shipments
// ──────────────────────────────────────────────────────────────────────────────
router.head("/shipping/pending", async (req, res, next) => {
  try {
    const total = await Order.countDocuments({ OrderStatus: /^pending$/i });
    setStandardHeadHeaders(res, {
      "X-Total-Count":   total.toString(),
      "X-Shipping-Type": "pending",
      "X-Resource":      "shipments"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/shipping/tracking/:orderId
// Check if tracking info exists for this order
// ──────────────────────────────────────────────────────────────────────────────
router.head("/shipping/tracking/:orderId", async (req, res, next) => {
  try {
    const order = await Order.findOne({ OrderID: req.params.orderId })
      .select("OrderID OrderStatus PaymentMethod")
      .lean();

    if (!order) {
      setStandardHeadHeaders(res, { "X-Tracking-Available": "false" });
      return res.status(404).end();
    }

    const carrierMap = {
      "UPI":         "BlueDart",
      "Debit Card":  "FedEx",
      "Credit Card": "DHL",
      "Net Banking": "DTDC",
      "COD":         "India Post",
      "Wallet":      "Delhivery"
    };
    const carrier = carrierMap[order.PaymentMethod] || "ShipRocket";

    setStandardHeadHeaders(res, {
      "X-Tracking-Available": "true",
      "X-Order-Status":       order.OrderStatus,
      "X-Carrier":            carrier,
      "X-Tracking-ID":        "TRK-" + req.params.orderId,
      "X-Resource":           "tracking"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/analytics/revenue/total
// Return revenue analytics metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/analytics/revenue/total", async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id:   null,
          total: { $sum: { $toDouble: "$TotalAmount" } },
          count: { $sum: 1 }
        }
      }
    ]);
    const totalRevenue = result[0]?.total?.toFixed(2) || "0.00";
    const totalOrders  = result[0]?.count             || 0;

    setStandardHeadHeaders(res, {
      "X-Total-Revenue": totalRevenue,
      "X-Total-Orders":  totalOrders.toString(),
      "X-Currency":      "INR",
      "X-Resource":      "revenue-analytics"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/stats/orders/total
// Return order statistics metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/stats/orders/total", async (req, res, next) => {
  try {
    const total = await Order.countDocuments({});
    setStandardHeadHeaders(res, {
      "X-Total-Orders": total.toString(),
      "X-Resource":     "order-stats",
      "X-Collection":   "amazonOrders"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/admin/users
// Return admin users metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/admin/users", async (req, res, next) => {
  try {
    const [total, activeUsers, adminUsers] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "admin" })
    ]);
    setStandardHeadHeaders(res, {
      "X-Total-Users":   total.toString(),
      "X-Active-Users":  activeUsers.toString(),
      "X-Admin-Users":   adminUsers.toString(),
      "X-Resource":      "admin-users",
      "X-Requires-Auth": "true",
      "X-Requires-Role": "admin"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/admin/orders
// Return admin orders metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/admin/orders", async (req, res, next) => {
  try {
    const total = await Order.countDocuments({});
    setStandardHeadHeaders(res, {
      "X-Total-Orders":  total.toString(),
      "X-Resource":      "admin-orders",
      "X-Requires-Auth": "true",
      "X-Requires-Role": "admin"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/dashboard/overview
// Return dashboard overview metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/dashboard/overview", async (req, res, next) => {
  try {
    const [orders, customers] = await Promise.all([
      Order.countDocuments({}),
      Order.distinct("CustomerID")
    ]);
    setStandardHeadHeaders(res, {
      "X-Total-Orders":    orders.toString(),
      "X-Total-Customers": customers.length.toString(),
      "X-Resource":        "dashboard-overview",
      "X-Dashboard-Type":  "overview"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/system/uptime
// Return server uptime metadata (no DB call)
// ──────────────────────────────────────────────────────────────────────────────
router.head("/system/uptime", (req, res, next) => {
  try {
    const uptimeSeconds = Math.floor(process.uptime());
    setStandardHeadHeaders(res, {
      "X-Uptime-Seconds": uptimeSeconds.toString(),
      "X-Node-Version":   process.version,
      "X-Platform":       process.platform,
      "X-Resource":       "system-uptime"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/system/status/database
// Check database connection status (no body)
// ──────────────────────────────────────────────────────────────────────────────
router.head("/system/status/database", (req, res, next) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    setStandardHeadHeaders(res, {
      "X-DB-Status":  isConnected ? "connected" : "disconnected",
      "X-DB-Host":    mongoose.connection.host || "unknown",
      "X-DB-Name":    mongoose.connection.name || "unknown",
      "X-Is-Healthy": isConnected.toString(),
      "X-Resource":   "database-status"
    });
    res.status(isConnected ? 200 : 503).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/system/status/cache
// Check in-memory cache status
// ──────────────────────────────────────────────────────────────────────────────
router.head("/system/status/cache", (req, res, next) => {
  try {
    const cacheSize = appCache.size;
    setStandardHeadHeaders(res, {
      "X-Cache-Status": "operational",
      "X-Cache-Type":   "in-memory",
      "X-Cache-Size":   cacheSize.toString(),
      "X-Is-Healthy":   "true",
      "X-Resource":     "cache-status"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/system/status/storage
// Return simulated storage metadata
// ──────────────────────────────────────────────────────────────────────────────
router.head("/system/status/storage", (req, res, next) => {
  try {
    setStandardHeadHeaders(res, {
      "X-Storage-Status":    "operational",
      "X-Storage-Type":      "local",
      "X-Storage-Used-MB":   "916.2",
      "X-Storage-Limit-MB":  "16384",
      "X-Storage-Usage-Pct": "5.59",
      "X-Is-Healthy":        "true",
      "X-Resource":          "storage-status"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/auth/profile
// Return auth profile route metadata (no actual auth check)
// ──────────────────────────────────────────────────────────────────────────────
router.head("/auth/profile", (req, res, next) => {
  try {
    setStandardHeadHeaders(res, {
      "X-Requires-Auth": "true",
      "X-Auth-Type":     "Bearer JWT",
      "X-Token-Type":    "access_token",
      "X-Resource":      "user-profile"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/notifications
// Return notifications metadata (in-memory, no DB call)
// ──────────────────────────────────────────────────────────────────────────────
router.head("/notifications", (req, res, next) => {
  try {
    setStandardHeadHeaders(res, {
      "X-Resource":          "notifications",
      "X-Notification-Type": "in-memory",
      "X-Supports-Filter":   "true",
      "X-Filter-Fields":     "isRead,type,priority"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/activity/logs
// Return activity logs metadata (in-memory, no DB call)
// ──────────────────────────────────────────────────────────────────────────────
router.head("/activity/logs", (req, res, next) => {
  try {
    setStandardHeadHeaders(res, {
      "X-Resource":        "activity-logs",
      "X-Log-Type":        "in-memory",
      "X-Max-Logs":        "1000",
      "X-Supports-Filter": "true",
      "X-Filter-Fields":   "action,entity,search"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// HEAD /api/v1/system/ping
// Fastest possible liveness check – no DB, no imports
// ──────────────────────────────────────────────────────────────────────────────
router.head("/system/ping", (req, res, next) => {
  try {
    setStandardHeadHeaders(res, {
      "X-Status":   "alive",
      "X-Ping":     "pong",
      "X-Resource": "ping"
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                         OPTIONS ROUTES                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/orders
// ──────────────────────────────────────────────────────────────────────────────
router.options("/orders", (req, res) => {
  setStandardOptionsHeaders(res, "GET, POST, HEAD, OPTIONS", {
    "X-Resource-Description": "Orders collection endpoint",
    "X-Pagination-Supported": "true",
    "X-Sorting-Supported":    "true",
    "X-Query-Params":         "page, limit, sort"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/orders/search
// NOTE: Before /orders/:orderId to avoid param capture
// ──────────────────────────────────────────────────────────────────────────────
router.options("/orders/search", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Order search endpoint",
    "X-Query-Params":         "q (search query), page, limit",
    "X-Search-Types":
      "global, customer, product, category, brand, status, payment, location, date, tracking, fuzzy, autocomplete, highlight"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/orders/filter/status
// NOTE: Before /orders/:orderId to avoid param capture
// ──────────────────────────────────────────────────────────────────────────────
router.options("/orders/filter/status", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Order filter by status endpoint",
    "X-Query-Params":         "type (status value), page, limit",
    "X-Allowed-Values":
      "Pending, Shipped, Out for Delivery, Delivered, Cancelled, Refunded, Returned"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/orders/:orderId
// ──────────────────────────────────────────────────────────────────────────────
router.options("/orders/:orderId", (req, res) => {
  setStandardOptionsHeaders(res, "GET, PUT, PATCH, DELETE, HEAD, OPTIONS", {
    "X-Resource-Description": "Single order resource endpoint",
    "X-Param":                "orderId (maps to OrderID field)"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/shipping/tracking/:orderId
// ──────────────────────────────────────────────────────────────────────────────
router.options("/shipping/tracking/:orderId", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Shipment tracking endpoint",
    "X-Param":                "orderId (maps to OrderID field)",
    "X-Tracking-Format":      "TRK-{OrderID}"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/shipping/create-label
// ──────────────────────────────────────────────────────────────────────────────
router.options("/shipping/create-label", (req, res) => {
  setStandardOptionsHeaders(res, "POST, OPTIONS", {
    "X-Resource-Description": "Shipping label creation endpoint",
    "X-Required-Body":        "orderID",
    "X-Optional-Body":        "labelType (default: standard)"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/auth/login
// ──────────────────────────────────────────────────────────────────────────────
router.options("/auth/login", (req, res) => {
  setStandardOptionsHeaders(res, "POST, OPTIONS", {
    "X-Resource-Description": "User login endpoint",
    "X-Required-Body":        "email, password",
    "X-Optional-Body":        "rememberMe",
    "X-Rate-Limited":         "true",
    "X-Rate-Limit":           "5 attempts per 15 minutes"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/auth/register
// ──────────────────────────────────────────────────────────────────────────────
router.options("/auth/register", (req, res) => {
  setStandardOptionsHeaders(res, "POST, OPTIONS", {
    "X-Resource-Description": "User registration endpoint",
    "X-Required-Body":        "name, email, password, confirmPassword",
    "X-Password-Rules":       "min 8 chars, 1 uppercase, 1 number, 1 special char"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/admin/users
// ──────────────────────────────────────────────────────────────────────────────
router.options("/admin/users", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Admin users management endpoint",
    "X-Requires-Auth":        "true",
    "X-Requires-Role":        "admin",
    "X-Query-Params":         "page, limit, role, isActive, isEmailVerified, search"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/admin/orders
// ──────────────────────────────────────────────────────────────────────────────
router.options("/admin/orders", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Admin orders management endpoint",
    "X-Requires-Auth":        "true",
    "X-Requires-Role":        "admin",
    "X-Query-Params":         "page, limit, status, category, country, search, startDate, endDate"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/admin/system/health
// ──────────────────────────────────────────────────────────────────────────────
router.options("/admin/system/health", (req, res) => {
  setStandardOptionsHeaders(res, "GET, OPTIONS", {
    "X-Resource-Description": "Admin system health check endpoint",
    "X-Requires-Auth":        "true",
    "X-Requires-Role":        "admin",
    "X-Returns":              "uptime, memory, cpu, database status"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/analytics/revenue/total
// ──────────────────────────────────────────────────────────────────────────────
router.options("/analytics/revenue/total", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Total revenue analytics endpoint",
    "X-Returns":              "totalRevenue, totalOrders, averageOrderValue",
    "X-Currency":             "INR"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/dashboard/overview
// ──────────────────────────────────────────────────────────────────────────────
router.options("/dashboard/overview", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Dashboard overview endpoint",
    "X-Returns":              "kpis, recentOrders",
    "X-Data-Sources":         "amazonOrders, users"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/notifications
// ──────────────────────────────────────────────────────────────────────────────
router.options("/notifications", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Notifications endpoint",
    "X-Query-Params":         "isRead, type, priority, page, limit",
    "X-Storage-Type":         "in-memory"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/system/version
// ──────────────────────────────────────────────────────────────────────────────
router.options("/system/version", (req, res) => {
  setStandardOptionsHeaders(res, "GET, OPTIONS", {
    "X-Resource-Description": "API version information endpoint",
    "X-API-Version":          "1.0.0",
    "X-Returns":              "version, environment, nodeVersion, endpoints"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/system/status/database
// ──────────────────────────────────────────────────────────────────────────────
router.options("/system/status/database", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Database health check endpoint",
    "X-DB-Technology":        "MongoDB with Mongoose",
    "X-Returns":              "status, latency, collections"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/system/status/cache
// ──────────────────────────────────────────────────────────────────────────────
router.options("/system/status/cache", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Cache health check endpoint",
    "X-Cache-Technology":     "in-memory Map",
    "X-Returns":              "status, cacheSize, stats"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/system/status/storage
// ──────────────────────────────────────────────────────────────────────────────
router.options("/system/status/storage", (req, res) => {
  setStandardOptionsHeaders(res, "GET, HEAD, OPTIONS", {
    "X-Resource-Description": "Storage health check endpoint",
    "X-Storage-Technology":   "Local File System (simulated)",
    "X-Returns":              "status, buckets, usageStats"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/validate/order
// ──────────────────────────────────────────────────────────────────────────────
router.options("/validate/order", (req, res) => {
  setStandardOptionsHeaders(res, "POST, OPTIONS", {
    "X-Resource-Description": "Order validation endpoint",
    "X-Required-Body":
      "OrderID, OrderDate, CustomerID, CustomerName, ProductID, ProductName, Category, Brand, Quantity, UnitPrice, TotalAmount, PaymentMethod, OrderStatus, City, State, Country, SellerID",
    "X-Optional-Body":      "Discount, Tax, ShippingCost",
    "X-Validation-Library": "none (pure JavaScript)"
  });
  res.status(204).end();
});

// ──────────────────────────────────────────────────────────────────────────────
// OPTIONS /api/v1/errors/not-found
// ──────────────────────────────────────────────────────────────────────────────
router.options("/errors/not-found", (req, res) => {
  setStandardOptionsHeaders(res, "GET, OPTIONS", {
    "X-Resource-Description": "404 error simulation endpoint",
    "X-Returns":              "404 Not Found error",
    "X-Purpose":              "Testing and documentation"
  });
  res.status(204).end();
});

module.exports = router;
