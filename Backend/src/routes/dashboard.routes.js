// src/routes/dashboard.routes.js
const express = require("express");
const router = express.Router();
const {
  overview,
  revenue,
  orders,
  customers,
  products
} = require("../controllers/dashboard.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// GET /api/v1/dashboard/overview
router.get("/overview",   protect, isAdmin, overview);

// GET /api/v1/dashboard/revenue
router.get("/revenue",    protect, isAdmin, revenue);

// GET /api/v1/dashboard/orders
router.get("/orders",     protect, isAdmin, orders);

// GET /api/v1/dashboard/customers
router.get("/customers",  protect, isAdmin, customers);

// GET /api/v1/dashboard/products
router.get("/products",   protect, isAdmin, products);

module.exports = router;
