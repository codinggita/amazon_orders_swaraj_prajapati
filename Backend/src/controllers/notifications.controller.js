// src/controllers/notifications.controller.js
const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require("../services/notifications.service");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/notifications
// ──────────────────────────────────────────────────────────────────────────────
exports.listNotifications = (req, res) => {
  try {
    const data = getNotifications(req.query);
    return res.status(200).json({
      success: true,
      message: "Notifications fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/notifications/read/:id
// ──────────────────────────────────────────────────────────────────────────────
exports.markNotificationRead = (req, res) => {
  try {
    const { id } = req.params;
    const result = markAsRead(id);

    if (result.status === "not_found") {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    if (result.status === "already_read") {
      return res.status(200).json({
        success: true,
        message: "Notification already marked as read"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/notifications/:id
// ──────────────────────────────────────────────────────────────────────────────
exports.removeNotification = (req, res) => {
  try {
    const { id } = req.params;
    const result = deleteNotification(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message
    });
  }
};
