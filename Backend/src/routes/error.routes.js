const express = require("express");
const router = express.Router();
const errorController = require("../controllers/error.controller");

router.get("/not-found", errorController.simulateNotFound);
router.get("/server-error", errorController.simulateServerError);
router.get("/database", errorController.simulateDatabaseError);
router.get("/validation", errorController.simulateValidationError);
router.get("/rate-limit", errorController.simulateRateLimitError);
router.get("/token-expired", errorController.simulateTokenExpiredError);
router.get("/payment-failed", errorController.simulatePaymentError);
router.get("/shipping-failed", errorController.simulateShippingError);
router.get("/upload-error", errorController.simulateUploadError);
router.get("/cache-error", errorController.simulateCacheError);

module.exports = router;
