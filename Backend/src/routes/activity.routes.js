// src/routes/activity.routes.js
const express = require("express");
const router = express.Router();
const { listActivityLogs } = require("../controllers/activity.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// GET /api/v1/activity/logs
router.get("/logs", protect, isAdmin, listActivityLogs);

module.exports = router;
