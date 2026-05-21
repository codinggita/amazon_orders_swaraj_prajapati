// src/routes/trending.routes.js
const express = require("express");
const router = express.Router();
const {
  trendingProducts,
  trendingCategories
} = require("../controllers/trending.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// GET /api/v1/trending/products
router.get("/products", protect, isAdmin, trendingProducts);

// GET /api/v1/trending/categories
router.get("/categories", protect, isAdmin, trendingCategories);

module.exports = router;
