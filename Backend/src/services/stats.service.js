const mongoose = require("mongoose");
const Order = require("../models/order.model");

// REUSABLE HELPERS
// Convert string field to double
const toDouble = (field) => ({ $toDouble: `$${field}` });

// Extract date parts from OrderDate string
const extractDay = () => ({ $substr: ["$OrderDate", 0, 10] });
const extractMonth = () => ({ $substr: ["$OrderDate", 0, 7] });
const extractYear = () => ({ $substr: ["$OrderDate", 0, 4] });

// Round to 2 decimal places
const round2 = (val) => Math.round(val * 100) / 100;

// Format uptime seconds to human readable
const formatUptime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

// Compute month over month growth array in JS
const computeGrowth = (arr, revenueKey) => {
  return arr.map((item, i) => {
    if (i === 0) return { ...item, growth: null };
    const prev = arr[i - 1][revenueKey];
    const curr = item[revenueKey];
    const growth = prev === 0 ? null : round2(((curr - prev) / prev) * 100);
    return { ...item, growth };
  });
};

class StatsService {
  /**
   * Return total number of all orders in collection and breakdown by status
   */
  async getTotalOrderStats() {
    try {
      const totalOrders = await Order.countDocuments();
      const statusBreakdownRaw = await Order.aggregate([
        {
          $group: {
            _id: "$OrderStatus",
            count: { $sum: 1 },
          },
        },
      ]);

      const statusBreakdown = statusBreakdownRaw.map((item) => ({
        status: item._id,
        count: item.count,
        percentage: totalOrders > 0 ? round2((item.count / totalOrders) * 100) : 0,
      }));

      return {
        totalOrders,
        statusBreakdown,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group orders by full date (YYYY-MM-DD) and count per day
   */
  async getDailyOrderStats(start, end) {
    try {
      const matchStage = {};
      if (start || end) {
        matchStage.OrderDate = {};
        if (start) matchStage.OrderDate.$gte = start;
        if (end) matchStage.OrderDate.$lte = end;
      }

      const daily = await Order.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: extractDay(),
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]);

      const totalDays = daily.length;
      const totalCount = daily.reduce((sum, day) => sum + day.count, 0);
      const averageOrdersPerDay = totalDays > 0 ? round2(totalCount / totalDays) : 0;

      return {
        totalDays,
        averageOrdersPerDay,
        daily,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group orders by month (YYYY-MM) and count per month
   */
  async getMonthlyOrderStats(year) {
    try {
      const matchStage = {};
      if (year) {
        matchStage.OrderDate = { $regex: `^${year}` };
      }

      const monthly = await Order.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: extractMonth(),
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            month: "$_id",
            count: 1,
          },
        },
      ]);

      const totalMonths = monthly.length;
      const totalCount = monthly.reduce((sum, mon) => sum + mon.count, 0);
      const averageOrdersPerMonth = totalMonths > 0 ? round2(totalCount / totalMonths) : 0;

      let peakMonth = { month: null, count: 0 };
      if (monthly.length > 0) {
        peakMonth = monthly.reduce((prev, curr) => (prev.count > curr.count ? prev : curr));
      }

      return {
        totalMonths,
        averageOrdersPerMonth,
        peakMonth,
        monthly,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group orders by year and count per year
   */
  async getYearlyOrderStats() {
    try {
      const yearly = await Order.aggregate([
        {
          $group: {
            _id: extractYear(),
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            year: "$_id",
            count: 1,
          },
        },
      ]);

      const totalYears = yearly.length;
      const totalCount = yearly.reduce((sum, yr) => sum + yr.count, 0);
      const averageOrdersPerYear = totalYears > 0 ? round2(totalCount / totalYears) : 0;

      let growthRate = 0;
      if (yearly.length >= 2) {
        const firstYearCount = yearly[0].count;
        const lastYearCount = yearly[yearly.length - 1].count;
        growthRate = round2(((lastYearCount - firstYearCount) / firstYearCount) * 100);
      }

      return {
        totalYears,
        averageOrdersPerYear,
        growthRate,
        yearly,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Total revenue with detailed breakdown
   */
  async getTotalRevenueStats() {
    try {
      const result = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: toDouble("TotalAmount") },
            totalTax: { $sum: toDouble("Tax") },
            totalDiscount: { $sum: toDouble("Discount") },
            totalShipping: { $sum: toDouble("ShippingCost") },
            averageOrderValue: { $avg: toDouble("TotalAmount") },
          },
        },
        {
          $project: {
            _id: 0,
            totalRevenue: { $round: ["$totalRevenue", 2] },
            totalTax: { $round: ["$totalTax", 2] },
            totalDiscount: { $round: ["$totalDiscount", 2] },
            totalShipping: { $round: ["$totalShipping", 2] },
            averageOrderValue: { $round: ["$averageOrderValue", 2] },
          },
        },
      ]);

      const data = result[0] || {
        totalRevenue: 0,
        totalTax: 0,
        totalDiscount: 0,
        totalShipping: 0,
        averageOrderValue: 0,
      };

      return {
        ...data,
        netRevenue: round2(data.totalRevenue - data.totalDiscount),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group revenue by day (YYYY-MM-DD), sum TotalAmount per day
   */
  async getDailyRevenueStats(start, end) {
    try {
      const matchStage = {};
      if (start || end) {
        matchStage.OrderDate = {};
        if (start) matchStage.OrderDate.$gte = start;
        if (end) matchStage.OrderDate.$lte = end;
      }

      const daily = await Order.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: extractDay(),
            revenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: { $round: ["$revenue", 2] },
            orderCount: 1,
          },
        },
      ]);

      const totalRevenue = daily.reduce((sum, day) => sum + day.revenue, 0);
      const totalDays = daily.length;
      const averageDailyRevenue = totalDays > 0 ? round2(totalRevenue / totalDays) : 0;

      let peakDay = { date: null, revenue: 0 };
      if (daily.length > 0) {
        peakDay = daily.reduce((prev, curr) => (prev.revenue > curr.revenue ? prev : curr));
      }

      return {
        totalRevenue: round2(totalRevenue),
        averageDailyRevenue,
        peakDay,
        daily,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group revenue by month (YYYY-MM), sum TotalAmount per month
   */
  async getMonthlyRevenueStats(year) {
    try {
      const matchStage = {};
      if (year) {
        matchStage.OrderDate = { $regex: `^${year}` };
      }

      const monthlyRaw = await Order.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: extractMonth(),
            revenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            month: "$_id",
            revenue: { $round: ["$revenue", 2] },
            orderCount: 1,
          },
        },
      ]);

      const monthly = computeGrowth(monthlyRaw, "revenue");
      const totalRevenue = monthly.reduce((sum, mon) => sum + mon.revenue, 0);
      const totalMonths = monthly.length;
      const averageMonthlyRevenue = totalMonths > 0 ? round2(totalRevenue / totalMonths) : 0;

      let peakMonth = { month: null, revenue: 0 };
      if (monthly.length > 0) {
        peakMonth = monthly.reduce((prev, curr) => (prev.revenue > curr.revenue ? prev : curr));
      }

      return {
        totalRevenue: round2(totalRevenue),
        averageMonthlyRevenue,
        peakMonth,
        monthly,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group revenue by year, sum TotalAmount per year
   */
  async getYearlyRevenueStats() {
    try {
      const yearly = await Order.aggregate([
        {
          $group: {
            _id: extractYear(),
            revenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            year: "$_id",
            revenue: { $round: ["$revenue", 2] },
            orderCount: 1,
          },
        },
      ]);

      const totalRevenue = yearly.reduce((sum, yr) => sum + yr.revenue, 0);
      const totalYears = yearly.length;
      const averageYearlyRevenue = totalYears > 0 ? round2(totalRevenue / totalYears) : 0;

      let revenueGrowthRate = 0;
      if (yearly.length >= 2) {
        const firstYearRev = yearly[0].revenue;
        const lastYearRev = yearly[yearly.length - 1].revenue;
        revenueGrowthRate = round2(((lastYearRev - firstYearRev) / firstYearRev) * 100);
      }

      return {
        totalRevenue: round2(totalRevenue),
        averageYearlyRevenue,
        revenueGrowthRate,
        yearly,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count distinct products and products per category
   */
  async getProductStats() {
    try {
      const [totalUniqueProductsResult, countByCategory] = await Promise.all([
        Order.aggregate([{ $group: { _id: "$ProductID" } }, { $count: "total" }]),
        Order.aggregate([
          {
            $group: {
              _id: { category: "$Category", product: "$ProductID" },
            },
          },
          {
            $group: {
              _id: "$_id.category",
              productCount: { $sum: 1 },
            },
          },
          { $sort: { productCount: -1 } },
          {
            $project: {
              _id: 0,
              category: "$_id",
              productCount: 1,
            },
          },
        ]),
      ]);

      return {
        totalUniqueProducts: totalUniqueProductsResult[0]?.total || 0,
        countByCategory,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count distinct customers, new/repeat customers
   */
  async getCustomerStats() {
    try {
      const customerOrders = await Order.aggregate([
        {
          $group: {
            _id: "$CustomerID",
            orderCount: { $sum: 1 },
          },
        },
      ]);

      const totalUniqueCustomers = customerOrders.length;
      let newCustomers = 0;
      let repeatCustomers = 0;
      let topCustomerOrderCount = 0;

      customerOrders.forEach((cust) => {
        if (cust.orderCount === 1) newCustomers++;
        else repeatCustomers++;

        if (cust.orderCount > topCustomerOrderCount) topCustomerOrderCount = cust.orderCount;
      });

      return {
        totalUniqueCustomers,
        newCustomers,
        repeatCustomers,
        topCustomerOrderCount,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get list of customers with pagination and search filter
   */
  async getCustomersList(q, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const matchStage = {};
      if (q) {
        matchStage.$or = [
          { CustomerName: { $regex: q, $options: "i" } },
          { CustomerID: { $regex: q, $options: "i" } }
        ];
      }

      const result = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$CustomerID",
            name: { $first: "$CustomerName" },
            ordersCount: { $sum: 1 },
            totalSpent: { $sum: toDouble("TotalAmount") },
            lastOrderDate: { $max: "$OrderDate" }
          }
        },
        {
          $facet: {
            metadata: [ { $count: "total" } ],
            data: [
              { $sort: { totalSpent: -1 } },
              { $skip: skip },
              { $limit: limit }
            ]
          }
        }
      ]);

      const customersRaw = result[0]?.data || [];
      const total = result[0]?.metadata[0]?.total || 0;

      const customers = customersRaw.map(c => {
        const cleanName = (c.name || "unknown").toLowerCase().replace(/[^a-z0-9]/g, "");
        const email = `${cleanName || "customer"}@example.com`;
        
        return {
          id: c._id || "unknown",
          name: c.name || "Unknown Customer",
          email: email,
          ordersCount: c.ordersCount,
          totalSpent: round2(c.totalSpent),
          lastOrderDate: c.lastOrderDate,
          status: "Active"
        };
      });

      return {
        customers,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count distinct categories and orders per category
   */
  async getCategoryStats() {
    try {
      const categories = await Order.aggregate([
        {
          $group: {
            _id: "$Category",
            orderCount: { $sum: 1 },
            totalItemsSold: { $sum: toDouble("Quantity") },
            totalRevenue: { $sum: toDouble("TotalAmount") },
          },
        },
        { $sort: { orderCount: -1 } },
        {
          $project: {
            _id: 0,
            category: "$_id",
            orderCount: 1,
            totalItemsSold: 1,
            totalRevenue: { $round: ["$totalRevenue", 2] },
          },
        },
      ]);

      return {
        totalUniqueCategories: categories.length,
        categories,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count refunded orders and related statistics
   */
  async getRefundStats() {
    try {
      const totalOrders = await Order.countDocuments();
      const [refundStats, refundsByMonth, topRefundedCategories] = await Promise.all([
        Order.aggregate([
          { $match: { OrderStatus: { $regex: /^Refunded$/i } } },
          {
            $group: {
              _id: null,
              totalRefunds: { $sum: 1 },
              totalRefundedAmount: { $sum: toDouble("TotalAmount") },
            },
          },
        ]),
        Order.aggregate([
          { $match: { OrderStatus: { $regex: /^Refunded$/i } } },
          {
            $group: {
              _id: extractMonth(),
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              month: "$_id",
              count: 1,
            },
          },
        ]),
        Order.aggregate([
          { $match: { OrderStatus: { $regex: /^Refunded$/i } } },
          {
            $group: {
              _id: "$Category",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              category: "$_id",
              count: 1,
            },
          },
        ]),
      ]);

      const totalRefunds = refundStats[0]?.totalRefunds || 0;
      const totalRefundedAmount = refundStats[0]?.totalRefundedAmount || 0;

      return {
        totalRefunds,
        totalRefundedAmount: round2(totalRefundedAmount),
        refundRate: totalOrders > 0 ? round2((totalRefunds / totalOrders) * 100) : 0,
        refundsByMonth,
        topRefundedCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count cancelled orders and related statistics
   */
  async getCancellationStats() {
    try {
      const totalOrders = await Order.countDocuments();
      const [cancelStats, cancellationsByMonth, topCancelledCategories] = await Promise.all([
        Order.aggregate([
          { $match: { OrderStatus: { $regex: /^Cancelled$/i } } },
          {
            $group: {
              _id: null,
              totalCancellations: { $sum: 1 },
              totalRevenueLost: { $sum: toDouble("TotalAmount") },
            },
          },
        ]),
        Order.aggregate([
          { $match: { OrderStatus: { $regex: /^Cancelled$/i } } },
          {
            $group: {
              _id: extractMonth(),
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              month: "$_id",
              count: 1,
            },
          },
        ]),
        Order.aggregate([
          { $match: { OrderStatus: { $regex: /^Cancelled$/i } } },
          {
            $group: {
              _id: "$Category",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              category: "$_id",
              count: 1,
            },
          },
        ]),
      ]);

      const totalCancellations = cancelStats[0]?.totalCancellations || 0;
      const totalRevenueLost = cancelStats[0]?.totalRevenueLost || 0;

      return {
        totalCancellations,
        totalRevenueLost: round2(totalRevenueLost),
        cancellationRate: totalOrders > 0 ? round2((totalCancellations / totalOrders) * 100) : 0,
        cancellationsByMonth,
        topCancelledCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Simulate shipping time statistics based on available data
   */
  async getShippingStats() {
    try {
      const [shippingStats, shippingCostByCategory] = await Promise.all([
        Order.aggregate([
          {
            $group: {
              _id: null,
              averageShippingCost: { $avg: toDouble("ShippingCost") },
              totalShippingRevenue: { $sum: toDouble("ShippingCost") },
              freeShippingOrders: {
                $sum: {
                  $cond: [{ $in: ["$ShippingCost", ["0", "0.0"]] }, 1, 0],
                },
              },
              paidShippingOrders: {
                $sum: {
                  $cond: [{ $not: { $in: ["$ShippingCost", ["0", "0.0"]] } }, 1, 0],
                },
              },
            },
          },
        ]),
        Order.aggregate([
          {
            $group: {
              _id: "$Category",
              avgShippingCost: { $avg: toDouble("ShippingCost") },
            },
          },
          { $sort: { avgShippingCost: -1 } },
          {
            $project: {
              _id: 0,
              category: "$_id",
              avgShippingCost: { $round: ["$avgShippingCost", 2] },
            },
          },
        ]),
      ]);

      const stats = shippingStats[0] || {
        averageShippingCost: 0,
        totalShippingRevenue: 0,
        freeShippingOrders: 0,
        paidShippingOrders: 0,
      };

      return {
        averageShippingCost: round2(stats.averageShippingCost),
        totalShippingRevenue: round2(stats.totalShippingRevenue),
        freeShippingOrders: stats.freeShippingOrders,
        paidShippingOrders: stats.paidShippingOrders,
        shippingCostByCategory,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return live system and API performance statistics
   */
  async getSystemPerformanceStats() {
    try {
      const uptimeSeconds = process.uptime();
      const totalDocumentsInCollection = await Order.countDocuments({});

      return {
        uptimeSeconds: round2(uptimeSeconds),
        uptimeFormatted: formatUptime(uptimeSeconds),
        memoryUsage: {
          heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB",
          heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + " MB",
          rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + " MB",
        },
        nodeVersion: process.version,
        platform: process.platform,
        cpuUsage: process.cpuUsage(),
        mongoStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        totalDocumentsInCollection,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatsService();
