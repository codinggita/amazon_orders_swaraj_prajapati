// src/routes/notifications.routes.js
const express = require("express");
const router = express.Router();
const {
  listNotifications,
  markNotificationRead,
  removeNotification
} = require("../controllers/notifications.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// GET    /api/v1/notifications
router.get("/", protect, isAdmin, listNotifications);

// PATCH  /api/v1/notifications/read/:id
// NOTE: This must come BEFORE the DELETE /:id route to avoid param conflicts
router.patch("/read/:id", protect, isAdmin, markNotificationRead);

// DELETE /api/v1/notifications/:id
router.delete("/:id", protect, isAdmin, removeNotification);

module.exports = router;
