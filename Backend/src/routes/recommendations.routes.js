// src/routes/recommendations.routes.js
const express = require("express");
const router = express.Router();
const {
  recommendProducts,
  recommendByOrder
} = require("../controllers/recommendations.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// GET /api/v1/recommendations/products/:customerId
router.get("/products/:customerId", protect, isAdmin, recommendProducts);

// GET /api/v1/recommendations/orders/:orderId
router.get("/orders/:orderId", protect, isAdmin, recommendByOrder);

module.exports = router;
