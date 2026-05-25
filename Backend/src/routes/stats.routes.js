const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

// Order stats
router.get("/orders/total", statsController.getTotalOrderStats);
router.get("/orders/daily", statsController.getDailyOrderStats);
router.get("/orders/monthly", statsController.getMonthlyOrderStats);
router.get("/orders/yearly", statsController.getYearlyOrderStats);

// Revenue stats
router.get("/revenue/total", statsController.getTotalRevenueStats);
router.get("/revenue/daily", statsController.getDailyRevenueStats);
router.get("/revenue/monthly", statsController.getMonthlyRevenueStats);
router.get("/revenue/yearly", statsController.getYearlyRevenueStats);

// Entity counts
router.get("/products/count", statsController.getProductStats);
router.get("/customers/count", statsController.getCustomerStats);
router.get("/customers/list", statsController.getCustomersList);
router.get("/categories/count", statsController.getCategoryStats);

// Failure stats
router.get("/refunds/count", statsController.getRefundStats);
router.get("/cancellations/count", statsController.getCancellationStats);

// Logistics stats
router.get("/shipping/average-time", statsController.getShippingStats);

// System stats
router.get("/system/performance", statsController.getSystemPerformanceStats);

module.exports = router;
