const express = require("express")
const app = express();
const orderRoutes = require("./routes/order.routes");
const searchRoutes = require("./routes/search.routes");
const filterRoutes = require("./routes/filter.routes");
const paginationRoutes = require("./routes/pagination.routes");
const sortRoutes = require("./routes/sort.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const statsRoutes = require("./routes/stats.routes");
const shippingRoutes = require("./routes/shipping.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const bulkRoutes = require("./routes/bulk.routes");
const errorRoutes = require("./routes/error.routes");
const { getMaintenanceStatus } = require("./services/admin.service");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

app.use(express.json())

app.use((req, res, next) => {
  const maintenanceMode = getMaintenanceStatus();
  if (maintenanceMode.enabled && !req.path.startsWith("/api/v1/auth")) {
    return res.status(503).json({
      success: false,
      message: maintenanceMode.message || "System under maintenance. Try again later.",
      maintenanceMode: true
    });
  }
  next();
});

// Bulk routes must be mounted BEFORE order routes to avoid conflicts with :orderId param
app.use("/api/v1/orders/bulk", bulkRoutes);

app.use("/api/v1/orders/search", searchRoutes);
app.use("/api/v1/orders/filter", filterRoutes);
app.use("/api/v1/orders/sort", sortRoutes);
app.use("/api/v1/orders", paginationRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/shipping", shippingRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/errors", errorRoutes);

// 404 handler - after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);

module.exports = app;