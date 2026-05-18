const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// User routes
router.get("/users", protect, isAdmin, adminController.getUsers);
router.get("/users/:id", protect, isAdmin, adminController.getUserById);
router.patch("/users/:id/ban", protect, isAdmin, adminController.banUser);
router.patch("/users/:id/unban", protect, isAdmin, adminController.unbanUser);
router.patch("/users/:id/role", protect, isAdmin, adminController.changeUserRole);

// Order routes
router.get("/orders", protect, isAdmin, adminController.getOrders);

// Report routes
router.get("/reports/sales", protect, isAdmin, adminController.getSalesReport);
router.get("/reports/revenue", protect, isAdmin, adminController.getRevenueReport);

// System & Cache routes
router.delete("/cache/clear", protect, isAdmin, adminController.clearCache);
router.get("/system/health", protect, isAdmin, adminController.getSystemHealth);
router.get("/system/logs", protect, isAdmin, adminController.getSystemLogs);
router.post("/system/maintenance", protect, isAdmin, adminController.toggleMaintenanceMode);

// Backup routes
router.get("/backups", protect, isAdmin, adminController.getBackups);

module.exports = router;
