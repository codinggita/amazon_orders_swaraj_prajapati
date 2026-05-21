// src/controllers/dashboard.controller.js
const {
  getOverview,
  getRevenueDashboard,
  getOrdersDashboard,
  getCustomersDashboard,
  getProductsDashboard
} = require("../services/dashboard.service");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/overview
// ──────────────────────────────────────────────────────────────────────────────
exports.overview = async (req, res) => {
  try {
    const data = await getOverview();
    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/revenue
// ──────────────────────────────────────────────────────────────────────────────
exports.revenue = async (req, res) => {
  try {
    const data = await getRevenueDashboard();
    return res.status(200).json({
      success: true,
      message: "Revenue dashboard fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue dashboard",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/orders
// ──────────────────────────────────────────────────────────────────────────────
exports.orders = async (req, res) => {
  try {
    const data = await getOrdersDashboard();
    return res.status(200).json({
      success: true,
      message: "Orders dashboard fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders dashboard",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/customers
// ──────────────────────────────────────────────────────────────────────────────
exports.customers = async (req, res) => {
  try {
    const data = await getCustomersDashboard();
    return res.status(200).json({
      success: true,
      message: "Customers dashboard fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers dashboard",
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/products
// ──────────────────────────────────────────────────────────────────────────────
exports.products = async (req, res) => {
  try {
    const data = await getProductsDashboard();
    return res.status(200).json({
      success: true,
      message: "Products dashboard fetched",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products dashboard",
      error: error.message
    });
  }
};
