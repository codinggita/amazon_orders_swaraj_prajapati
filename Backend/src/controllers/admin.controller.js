const adminService = require("../services/admin.service");

exports.getUsers = async (req, res) => {
  try {
    const data = await adminService.getUsers(req.query, req.user.id);
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: data.users,
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const data = await adminService.getUserById(req.params.id, req.user.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const data = await adminService.banUser(req.params.id, req.user.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User banned successfully",
      data
    });
  } catch (error) {
    if (error.message === "You cannot ban your own account" || error.message === "User is already banned") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error banning user", error: error.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const data = await adminService.unbanUser(req.params.id, req.user.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data
    });
  } catch (error) {
    if (error.message === "User is not banned") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error unbanning user", error: error.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const data = await adminService.changeUserRole(req.params.id, req.body.role, req.user.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User role updated to admin",
      data
    });
  } catch (error) {
    if (error.message === "You cannot change your own role" || error.message === "Role must be user or admin") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error changing user role", error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await adminService.getOrders(req.query, req.user.id);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: data.orders,
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const data = await adminService.getSalesReport(req.user.id);
    res.status(200).json({
      success: true,
      message: "Sales report generated successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating sales report", error: error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const data = await adminService.getRevenueReport(req.user.id);
    res.status(200).json({
      success: true,
      message: "Revenue report generated successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating revenue report", error: error.message });
  }
};

exports.clearCache = (req, res) => {
  try {
    const data = adminService.clearCache(req.user.id, req.user.email);
    res.status(200).json({
      success: true,
      message: "Application cache cleared successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cache", error: error.message });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    const data = await adminService.getSystemHealth(req.user.id);
    res.status(200).json({
      success: true,
      message: "System health fetched successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching system health", error: error.message });
  }
};

exports.getSystemLogs = (req, res) => {
  try {
    const data = adminService.getSystemLogs(req.query);
    res.status(200).json({
      success: true,
      message: "Server logs fetched successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching logs", error: error.message });
  }
};

exports.toggleMaintenanceMode = (req, res) => {
  try {
    const data = adminService.toggleMaintenanceMode(req.body, req.user.id, req.user.email);
    res.status(200).json({
      success: true,
      message: "Maintenance mode enabled successfully",
      data
    });
  } catch (error) {
    if (error.message === "enabled must be a boolean" || error.message === "Maintenance message is required when enabling") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error toggling maintenance mode", error: error.message });
  }
};

exports.getBackups = async (req, res) => {
  try {
    const data = await adminService.getBackups(req.user.id);
    res.status(200).json({
      success: true,
      message: "Backups fetched successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching backups", error: error.message });
  }
};
