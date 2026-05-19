const express = require("express");
const router = express.Router();
const bulkController = require("../controllers/bulk.controller");

// POST routes
router.post("/create", bulkController.bulkCreate);
router.post("/apply-discount", bulkController.bulkApplyDiscount);

// PATCH routes
router.patch("/update", bulkController.bulkUpdate);
router.patch("/status", bulkController.bulkUpdateStatus);
router.patch("/archive", bulkController.bulkArchive);
router.patch("/restore", bulkController.bulkRestore);
router.patch("/payment-status", bulkController.bulkUpdatePaymentStatus);
router.patch("/shipping-status", bulkController.bulkUpdateShippingStatus);

// DELETE routes
router.delete("/delete", bulkController.bulkDelete);
router.delete("/cleanup-cancelled", bulkController.cleanupCancelled);

module.exports = router;
