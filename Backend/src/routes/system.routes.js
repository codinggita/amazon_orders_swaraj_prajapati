// src/routes/system.routes.js
const express = require("express");
const router = express.Router();
const {
  version,
  config,
  uptime,
  pingHandler,
  databaseStatus,
  cacheStatus,
  storageStatus
} = require("../controllers/system.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// Public endpoints (no auth required for quick health checks)
// GET /api/v1/system/ping
router.get("/ping", pingHandler);

// Protected endpoints (admin only)
// GET /api/v1/system/version
router.get("/version", protect, isAdmin, version);

// GET /api/v1/system/config
router.get("/config", protect, isAdmin, config);

// GET /api/v1/system/uptime
router.get("/uptime", protect, isAdmin, uptime);

// GET /api/v1/system/status/database
router.get("/status/database", protect, isAdmin, databaseStatus);

// GET /api/v1/system/status/cache
router.get("/status/cache", protect, isAdmin, cacheStatus);

// GET /api/v1/system/status/storage
router.get("/status/storage", protect, isAdmin, storageStatus);

module.exports = router;
