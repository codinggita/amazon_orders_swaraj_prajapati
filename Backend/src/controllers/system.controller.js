// src/controllers/system.controller.js
const {
  getVersion,
  getConfig,
  getUptime,
  ping,
  getDatabaseStatus,
  getCacheStatus,
  getStorageStatus
} = require("../services/system.service");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/version
// ──────────────────────────────────────────────────────────────────────────────
exports.version = (req, res) => {
  try {
    const data = getVersion();
    return res.status(200).json({
      success: true,
      message: "API version fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch version info",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/config
// ──────────────────────────────────────────────────────────────────────────────
exports.config = (req, res) => {
  try {
    const data = getConfig();
    return res.status(200).json({
      success: true,
      message: "Public config fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch config",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/uptime
// ──────────────────────────────────────────────────────────────────────────────
exports.uptime = (req, res) => {
  try {
    const data = getUptime();
    return res.status(200).json({
      success: true,
      message: "Server uptime fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch uptime",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/ping
// ──────────────────────────────────────────────────────────────────────────────
exports.pingHandler = (req, res) => {
  try {
    const data = ping();
    return res.status(200).json({
      success: true,
      message: "pong",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ping failed",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/status/database
// ──────────────────────────────────────────────────────────────────────────────
exports.databaseStatus = async (req, res) => {
  try {
    const data = await getDatabaseStatus();
    return res.status(200).json({
      success: true,
      message: "Database status fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch database status",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/status/cache
// ──────────────────────────────────────────────────────────────────────────────
exports.cacheStatus = (req, res) => {
  try {
    const data = getCacheStatus();
    return res.status(200).json({
      success: true,
      message: "Cache status fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cache status",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/system/status/storage
// ──────────────────────────────────────────────────────────────────────────────
exports.storageStatus = (req, res) => {
  try {
    const data = getStorageStatus();
    return res.status(200).json({
      success: true,
      message: "Storage status fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch storage status",
      error: error.message
    });
  }
};
