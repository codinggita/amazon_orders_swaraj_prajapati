// src/routes/notifications.routes.js
const express = require("express");
const router = express.Router();
const {
  listNotifications,
  markNotificationRead,
  removeNotification
} = require("../controllers/notifications.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// GET    /api/v1/notifications — all authenticated users
router.get("/", protect, listNotifications);

// PATCH  /api/v1/notifications/read/:id
router.patch("/read/:id", protect, markNotificationRead);

// DELETE /api/v1/notifications/:id — admin only
router.delete("/:id", protect, isAdmin, removeNotification);

module.exports = router;
