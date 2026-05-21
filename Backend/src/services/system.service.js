// src/services/system.service.js
const mongoose = require("mongoose");
const Order    = require("../models/order.model");
const User     = require("../models/user.model");
const appCache = require("../utils/cache");

// Track server start time for uptime calculations
const appStartTime = Date.now();

// ──────────────────────────────────────────────────────────────────────────────
// Helper: format milliseconds into human-readable uptime string
// ──────────────────────────────────────────────────────────────────────────────
const formatUptime = (ms) => {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000)  / 60000);
  const s = Math.floor((ms % 60000)    / 1000);
  return `${d}d ${h}h ${m}m ${s}s`;
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/version
// ──────────────────────────────────────────────────────────────────────────────
exports.getVersion = () => {
  try {
    return {
      name:        "Amazon Orders API",
      version:     process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      platform:    process.platform,
      architecture:process.arch,
      description: "REST API for Amazon Orders Management System",
      author:      "Backend Team",
      apiPrefix:   "/api/v1",
      endpoints: {
        orders:          "/api/v1/orders",
        analytics:       "/api/v1/analytics",
        stats:           "/api/v1/stats",
        auth:            "/api/v1/auth",
        admin:           "/api/v1/admin",
        shipping:        "/api/v1/shipping",
        dashboard:       "/api/v1/dashboard",
        system:          "/api/v1/system",
        recommendations: "/api/v1/recommendations",
        trending:        "/api/v1/trending",
        notifications:   "/api/v1/notifications",
        activity:        "/api/v1/activity"
      },
      builtAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/config
// ──────────────────────────────────────────────────────────────────────────────
exports.getConfig = () => {
  try {
    return {
      environment: process.env.NODE_ENV || "development",
      pagination: {
        defaultPage:  1,
        defaultLimit: 10,
        maxLimit:     100
      },
      upload: {
        maxFileSizeMB:   5,
        allowedFormats:  ["jpg", "jpeg", "png", "pdf", "csv", "xlsx"]
      },
      supportedCurrencies:     ["INR", "USD", "EUR", "GBP"],
      supportedPaymentMethods: ["UPI", "Debit Card", "Credit Card", "Net Banking", "COD", "Wallet"],
      orderStatuses: [
        "Pending", "Shipped", "Out for Delivery", "Delivered",
        "Cancelled", "Refunded", "Returned"
      ],
      supportedCarriers: [
        "BlueDart", "FedEx", "DHL", "DTDC", "India Post", "Delhivery", "ShipRocket"
      ],
      rateLimits: {
        general: "100 requests per 15 minutes",
        login:   "5 attempts per 15 minutes",
        otp:     "3 attempts per 10 minutes"
      },
      features: {
        bulkOperations:  true,
        recommendations: true,
        trending:        true,
        notifications:   true,
        analytics:       true,
        shipping:        true
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/uptime
// ──────────────────────────────────────────────────────────────────────────────
exports.getUptime = () => {
  try {
    const uptimeMs      = Date.now() - appStartTime;
    const uptimeSeconds = uptimeMs / 1000;
    const mem           = process.memoryUsage();

    return {
      uptimeFormatted:  formatUptime(uptimeMs),
      uptimeSeconds:    Math.round(uptimeSeconds),
      uptimeMs,
      serverStartedAt:  new Date(appStartTime).toISOString(),
      currentTime:      new Date().toISOString(),
      memoryUsage: {
        heapUsed:  (mem.heapUsed  / 1024 / 1024).toFixed(2) + " MB",
        heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(2) + " MB",
        rss:       (mem.rss       / 1024 / 1024).toFixed(2) + " MB"
      },
      cpuUsage: process.cpuUsage(),
      pid: process.pid
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/ping
// ──────────────────────────────────────────────────────────────────────────────
exports.ping = () => {
  return {
    ping:         "pong",
    timestamp:    new Date().toISOString(),
    responseTime: "< 1ms",
    server:       "Amazon Orders API",
    status:       "alive"
  };
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/status/database
// ──────────────────────────────────────────────────────────────────────────────
exports.getDatabaseStatus = async () => {
  try {
    const state      = mongoose.connection.readyState;
    const stateMap   = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    const stateLabel = stateMap[state] || "unknown";
    const isHealthy  = state === 1;

    if (!isHealthy) {
      return {
        status:      "disconnected",
        state,
        stateLabel,
        isHealthy:   false,
        checkedAt:   new Date().toISOString()
      };
    }

    // Ping the DB
    const pingStart = Date.now();
    await mongoose.connection.db.admin().ping();
    const latencyMs = Date.now() - pingStart;

    const [totalOrders, totalUsers] = await Promise.all([
      Order.countDocuments({}),
      User.countDocuments({})
    ]);

    return {
      status:     "connected",
      state,
      stateLabel,
      host:       mongoose.connection.host,
      port:       mongoose.connection.port,
      name:       mongoose.connection.name,
      latencyMs,
      collections: { totalOrders, totalUsers },
      isHealthy:  true,
      checkedAt:  new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/status/cache
// ──────────────────────────────────────────────────────────────────────────────
exports.getCacheStatus = () => {
  try {
    const totalKeys = appCache.size;
    const memoryEstimateKB =
      Math.round(
        (JSON.stringify([...appCache.entries()]).length / 1024) * 100
      ) / 100;

    return {
      type:      "in-memory",
      status:    "operational",
      isHealthy: true,
      stats: {
        totalKeys,
        memoryEstimateKB,
        cacheType:   "Map (in-memory)",
        persistence: false,
        note:        "Cache resets on server restart"
      },
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/status/storage
// ──────────────────────────────────────────────────────────────────────────────
exports.getStorageStatus = () => {
  try {
    const buckets = [
      {
        name:         "amazon-orders-uploads",
        purpose:      "User uploaded files",
        usedMB:       248.5,
        limitMB:      5120,
        usagePercent: 4.85,
        status:       "healthy"
      },
      {
        name:         "amazon-orders-backups",
        purpose:      "Database backups",
        usedMB:       622.5,
        limitMB:      10240,
        usagePercent: 6.08,
        status:       "healthy"
      },
      {
        name:         "amazon-orders-logs",
        purpose:      "Application logs",
        usedMB:       45.2,
        limitMB:      1024,
        usagePercent: 4.41,
        status:       "healthy"
      }
    ];

    const totalUsedMB        = Math.round(buckets.reduce((sum, b) => sum + b.usedMB, 0) * 100) / 100;
    const totalLimitMB       = buckets.reduce((sum, b) => sum + b.limitMB, 0);
    const overallUsagePercent= Math.round((totalUsedMB / totalLimitMB) * 10000) / 100;

    return {
      type:      "local",
      status:    "operational",
      isHealthy: true,
      storage: {
        provider:            "Local File System",
        region:              "ap-south-1",
        buckets,
        totalUsedMB,
        totalLimitMB,
        overallUsagePercent
      },
      note:      "Simulated storage stats for development environment",
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};
