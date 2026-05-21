// src/controllers/recommendations.controller.js
const {
  getProductRecommendations,
  getOrderRecommendations
} = require("../services/recommendations.service");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/recommendations/products/:customerId
// ──────────────────────────────────────────────────────────────────────────────
exports.recommendProducts = async (req, res) => {
  try {
    const { customerId } = req.params;
    const data = await getProductRecommendations(customerId);

    return res.status(200).json({
      success: true,
      message: "Product recommendations fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product recommendations",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/recommendations/orders/:orderId
// ──────────────────────────────────────────────────────────────────────────────
exports.recommendByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const data = await getOrderRecommendations(orderId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Similar product recommendations fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order recommendations",
      error: error.message
    });
  }
};
