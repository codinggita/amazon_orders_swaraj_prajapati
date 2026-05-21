// src/controllers/trending.controller.js
const {
  getTrendingProducts,
  getTrendingCategories
} = require("../services/trending.service");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/trending/products
// ──────────────────────────────────────────────────────────────────────────────
exports.trendingProducts = async (req, res) => {
  try {
    const data = await getTrendingProducts(req.query);
    return res.status(200).json({
      success: true,
      message: "Trending products fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending products",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/trending/categories
// ──────────────────────────────────────────────────────────────────────────────
exports.trendingCategories = async (req, res) => {
  try {
    const data = await getTrendingCategories(req.query);
    return res.status(200).json({
      success: true,
      message: "Trending categories fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending categories",
      error: error.message
    });
  }
};
