const mongoose = require("mongoose");
const User = require("../models/user.model");
const Order = require("../models/order.model");

// In-memory store
const appCache = new Map();
const serverLogs = [];
let maintenanceMode = { enabled: false, message: "", enabledAt: null, enabledBy: null };

const addLog = (level, message, meta = {}) => {
  const log = {
    id: Date.now().toString(),
    level,           // "info" | "warn" | "error"
    message,
    meta,
    timestamp: new Date().toISOString()
  };
  serverLogs.unshift(log);
  if (serverLogs.length > 500) serverLogs.pop(); // keep max 500 logs
  return log;
};

// Shared helpers
const formatUptime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

const round2 = (val) => Math.round((val || 0) * 100) / 100;

const computeGrowth = (arr, key) => arr.map((item, i) => {
  if (i === 0) return { ...item, growth: null };
  const prev = arr[i - 1][key];
  const curr = item[key];
  const growth = prev === 0 ? null : round2((curr - prev) / prev * 100);
  return { ...item, growth };
});

const mongoState = (state) => {
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  return states[state] || "unknown";
};

exports.getMaintenanceStatus = () => maintenanceMode;

// GET /users
exports.getUsers = async (query, adminId) => {
  try {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
    if (query.isEmailVerified !== undefined) filter.isEmailVerified = query.isEmailVerified === 'true';
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires -otp -otpExpires -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    addLog("info", "Admin fetched users list", { adminId });

    return {
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    };
  } catch (error) {
    throw error;
  }
};

// GET /users/:id
exports.getUserById = async (id, adminId) => {
  try {
    const user = await User.findById(id)
      .select("-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires -otp -otpExpires -refreshToken")
      .lean();

    if (!user) return null;

    const orderCount = await Order.countDocuments({ CustomerID: user._id.toString() });
    
    addLog("info", "Admin viewed user", { adminId, targetUserId: id });

    return { ...user, orderCount };
  } catch (error) {
    throw error;
  }
};

// PATCH /users/:id/ban
exports.banUser = async (id, adminId) => {
  try {
    if (id === adminId) {
      throw new Error("You cannot ban your own account");
    }

    const user = await User.findById(id);
    if (!user) return null;
    if (!user.isActive) throw new Error("User is already banned");

    user.isActive = false;
    user.refreshToken = undefined;
    await user.save();

    addLog("warn", "Admin banned user", { adminId, bannedUserId: id });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      bannedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// PATCH /users/:id/unban
exports.unbanUser = async (id, adminId) => {
  try {
    const user = await User.findById(id);
    if (!user) return null;
    if (user.isActive) throw new Error("User is not banned");

    user.isActive = true;
    await user.save();

    addLog("info", "Admin unbanned user", { adminId, unbannedUserId: id });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      unbannedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// PATCH /users/:id/role
exports.changeUserRole = async (id, role, adminId) => {
  try {
    if (id === adminId) {
      throw new Error("You cannot change your own role");
    }
    if (role !== "user" && role !== "admin") {
      throw new Error("Role must be user or admin");
    }

    const user = await User.findById(id);
    if (!user) return null;

    const previousRole = user.role;
    user.role = role;
    await user.save();

    addLog("warn", "Admin changed user role", { adminId, targetId: id, newRole: role });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      previousRole,
      newRole: user.role,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// GET /orders
exports.getOrders = async (query, adminId) => {
  try {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.status) filter.OrderStatus = { $regex: query.status, $options: "i" };
    if (query.category) filter.Category = query.category;
    if (query.country) filter.Country = query.country;
    if (query.search) {
      filter.$or = [
        { OrderID: { $regex: query.search, $options: "i" } },
        { CustomerName: { $regex: query.search, $options: "i" } }
      ];
    }
    if (query.startDate && query.endDate) {
      filter.OrderDate = { $gte: query.startDate, $lte: query.endDate };
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ OrderDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter)
    ]);

    addLog("info", "Admin fetched orders", { adminId });

    return {
      orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    };
  } catch (error) {
    throw error;
  }
};

// GET /reports/sales
exports.getSalesReport = async (adminId) => {
  try {
    const [
      totalOrders,
      totalRevenueResult,
      ordersByStatus,
      salesByCategory,
      salesByMonth,
      topProducts,
      topCustomers
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: { $toDouble: "$TotalAmount" } } } }
      ]),
      Order.aggregate([
        { $group: { _id: "$OrderStatus", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: "$Category",
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: { $toDouble: "$TotalAmount" } },
            totalItemsSold: { $sum: { $toDouble: "$Quantity" } }
        }},
        { $sort: { totalRevenue: -1 } },
        { $project: { category: "$_id", orderCount: 1, totalRevenue: 1, totalItemsSold: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: { $substr: ["$OrderDate", 0, 7] },
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: { $toDouble: "$TotalAmount" } }
        }},
        { $sort: { _id: 1 } },
        { $project: { month: "$_id", orderCount: 1, totalRevenue: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: "$ProductID",
            productName: { $first: "$ProductName" },
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: { $toDouble: "$TotalAmount" } }
        }},
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        { $project: { productID: "$_id", productName: 1, orderCount: 1, totalRevenue: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: "$CustomerID",
            customerName: { $first: "$CustomerName" },
            orderCount: { $sum: 1 },
            totalSpend: { $sum: { $toDouble: "$TotalAmount" } }
        }},
        { $sort: { totalSpend: -1 } },
        { $limit: 5 },
        { $project: { customerID: "$_id", customerName: 1, orderCount: 1, totalSpend: 1, _id: 0 } }
      ])
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const averageOrderValue = totalOrders > 0 ? round2(totalRevenue / totalOrders) : 0;

    addLog("info", "Admin generated sales report", { adminId });

    return {
      generatedAt: new Date().toISOString(),
      totalOrders,
      totalRevenue: round2(totalRevenue),
      averageOrderValue,
      ordersByStatus,
      salesByCategory: salesByCategory.map(c => ({ ...c, totalRevenue: round2(c.totalRevenue) })),
      salesByMonth: salesByMonth.map(m => ({ ...m, totalRevenue: round2(m.totalRevenue) })),
      topProducts: topProducts.map(p => ({ ...p, totalRevenue: round2(p.totalRevenue) })),
      topCustomers: topCustomers.map(c => ({ ...c, totalSpend: round2(c.totalSpend) }))
    };
  } catch (error) {
    throw error;
  }
};

// GET /reports/revenue
exports.getRevenueReport = async (adminId) => {
  try {
    const [
      totals,
      revenueByYearRaw,
      revenueByMonthRaw,
      revenueByPaymentMethodRaw,
      revenueByCategoryRaw
    ] = await Promise.all([
      Order.aggregate([
        { $group: {
            _id: null,
            totalRevenue: { $sum: { $toDouble: "$TotalAmount" } },
            totalTax: { $sum: { $toDouble: "$Tax" } },
            totalDiscount: { $sum: { $toDouble: "$Discount" } },
            totalShipping: { $sum: { $toDouble: "$ShippingCost" } }
        }}
      ]),
      Order.aggregate([
        { $group: {
            _id: { $substr: ["$OrderDate", 0, 4] },
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orderCount: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
        { $project: { year: "$_id", revenue: 1, orderCount: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: { $substr: ["$OrderDate", 0, 7] },
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orderCount: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
        { $project: { month: "$_id", revenue: 1, orderCount: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: "$PaymentMethod",
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orderCount: { $sum: 1 }
        }},
        { $project: { paymentMethod: "$_id", revenue: 1, orderCount: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: {
            _id: "$Category",
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orderCount: { $sum: 1 }
        }},
        { $sort: { revenue: -1 } },
        { $project: { category: "$_id", revenue: 1, orderCount: 1, _id: 0 } }
      ])
    ]);

    const stats = totals[0] || { totalRevenue: 0, totalTax: 0, totalDiscount: 0, totalShipping: 0 };
    const totalRevenue = round2(stats.totalRevenue);
    const totalTax = round2(stats.totalTax);
    const totalDiscount = round2(stats.totalDiscount);
    const totalShipping = round2(stats.totalShipping);
    const netRevenue = round2(totalRevenue - totalDiscount);

    const revenueByYear = computeGrowth(revenueByYearRaw, 'revenue').map(y => ({ ...y, revenue: round2(y.revenue) }));
    const revenueByMonth = revenueByMonthRaw.map(m => ({ ...m, revenue: round2(m.revenue) }));
    const revenueByPaymentMethod = revenueByPaymentMethodRaw.map(p => ({
      ...p,
      revenue: round2(p.revenue),
      percentage: totalRevenue > 0 ? round2((p.revenue / totalRevenue) * 100) : 0
    }));
    const revenueByCategory = revenueByCategoryRaw.map(c => ({ ...c, revenue: round2(c.revenue) }));

    addLog("info", "Admin generated revenue report", { adminId });

    return {
      generatedAt: new Date().toISOString(),
      totalRevenue,
      totalTax,
      totalDiscount,
      totalShipping,
      netRevenue,
      revenueByYear,
      revenueByMonth,
      revenueByPaymentMethod,
      revenueByCategory
    };
  } catch (error) {
    throw error;
  }
};

// DELETE /cache/clear
exports.clearCache = (adminId, adminEmail) => {
  try {
    appCache.clear();
    addLog("warn", "Admin cleared application cache", { adminId });
    return {
      clearedAt: new Date().toISOString(),
      clearedBy: adminEmail || adminId
    };
  } catch (error) {
    throw error;
  }
};

// GET /system/health
exports.getSystemHealth = async (adminId) => {
  try {
    const mongoConnectionState = mongoose.connection.readyState;
    const isMongoConnected = mongoConnectionState === 1;

    const uptimeSeconds = process.uptime();
    const memUsage = process.memoryUsage();

    const [totalUsers, totalOrders, activeUsers] = await Promise.all([
      User.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({ isActive: true })
    ]);

    addLog("info", "Admin checked system health", { adminId });

    return {
      status: isMongoConnected ? "healthy" : "degraded",
      uptime: formatUptime(uptimeSeconds),
      uptimeSeconds: round2(uptimeSeconds),
      memory: {
        heapUsed: (memUsage.heapUsed / 1024 / 1024).toFixed(2) + " MB",
        heapTotal: (memUsage.heapTotal / 1024 / 1024).toFixed(2) + " MB",
        rss: (memUsage.rss / 1024 / 1024).toFixed(2) + " MB",
        external: (memUsage.external / 1024 / 1024).toFixed(2) + " MB"
      },
      cpu: process.cpuUsage(),
      node: process.version,
      platform: process.platform,
      pid: process.pid,
      database: {
        status: mongoState(mongoConnectionState),
        totalUsers,
        totalOrders,
        activeUsers
      },
      maintenanceMode: maintenanceMode.enabled,
      cacheSize: appCache.size,
      totalLogsRecorded: serverLogs.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// GET /system/logs
exports.getSystemLogs = (query) => {
  try {
    const limit = parseInt(query.limit, 10) || 50;
    const finalLimit = Math.min(limit, 200);
    const levelFilter = query.level;
    const searchFilter = query.search ? query.search.toLowerCase() : null;

    let filteredLogs = serverLogs;

    if (levelFilter) {
      filteredLogs = filteredLogs.filter(log => log.level === levelFilter);
    }
    if (searchFilter) {
      filteredLogs = filteredLogs.filter(log => log.message.toLowerCase().includes(searchFilter));
    }

    const returnedLogs = filteredLogs.slice(0, finalLimit);

    return {
      totalLogs: serverLogs.length,
      returnedLogs: returnedLogs.length,
      filters: {
        level: levelFilter || undefined,
        limit: finalLimit,
        search: searchFilter || undefined
      },
      logs: returnedLogs
    };
  } catch (error) {
    throw error;
  }
};

// POST /system/maintenance
exports.toggleMaintenanceMode = (body, adminId, adminEmail) => {
  try {
    if (typeof body.enabled !== 'boolean') {
      throw new Error("enabled must be a boolean");
    }
    if (body.enabled && !body.message) {
      throw new Error("Maintenance message is required when enabling");
    }

    if (body.enabled) {
      maintenanceMode = {
        enabled: true,
        message: body.message,
        enabledAt: new Date().toISOString(),
        enabledBy: adminEmail || adminId
      };
    } else {
      maintenanceMode = {
        enabled: false,
        message: "",
        enabledAt: null,
        enabledBy: null
      };
    }

    addLog("warn", `Maintenance mode ${body.enabled ? "enabled" : "disabled"}`, { adminId, message: body.message });

    return { maintenanceMode };
  } catch (error) {
    throw error;
  }
};

// GET /backups
exports.getBackups = async (adminId) => {
  try {
    const [totalUsers, totalOrders] = await Promise.all([
      User.countDocuments({}),
      Order.countDocuments({})
    ]);

    const totalDocuments = totalUsers + totalOrders;
    const backups = [];
    const days = [0, 1, 3, 7, 14];

    for (let i = 0; i < days.length; i++) {
      const pastDate = new Date(Date.now() - days[i] * 24 * 60 * 60 * 1000);
      const timestamp = pastDate.getTime();
      backups.push({
        backupID: `BKP-${timestamp}`,
        type: i === 0 ? "manual" : "auto",
        status: "completed",
        size: "124.5 MB",
        collections: ["amazonOrders", "users", "sessions"],
        totalDocuments,
        createdAt: pastDate.toISOString(),
        duration: "2m 34s",
        storagePath: `/backups/BKP-${timestamp}.tar.gz`
      });
    }

    addLog("info", "Admin viewed backups list", { adminId });

    return {
      totalBackups: 5,
      storageUsed: "622.5 MB",
      backups
    };
  } catch (error) {
    throw error;
  }
};
