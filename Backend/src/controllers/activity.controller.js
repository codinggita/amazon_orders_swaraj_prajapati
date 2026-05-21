// src/controllers/activity.controller.js
const { getActivityLogs } = require("../services/activity.service");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/activity/logs
// ──────────────────────────────────────────────────────────────────────────────
exports.listActivityLogs = (req, res) => {
  try {
    const data = getActivityLogs(req.query);
    return res.status(200).json({
      success: true,
      message: "Activity logs fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message
    });
  }
};
