const express = require("express");
const validateController = require("../controllers/validate.controller");

const router = express.Router();

router.post("/order", validateController.validateOrder);
router.patch("/order/:id", validateController.validateOrderUpdate);
router.post("/payment", validateController.validatePayment);
router.post("/address", validateController.validateAddress);
router.post("/auth/register", validateController.validateRegister);
router.post("/auth/login", validateController.validateLogin);
router.post("/product", validateController.validateProduct);
router.post("/refund", validateController.validateRefund);
router.post("/coupon", validateController.validateCoupon);
router.post("/upload", validateController.validateUpload);

module.exports = router;
