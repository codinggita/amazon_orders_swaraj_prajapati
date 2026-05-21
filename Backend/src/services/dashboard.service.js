// src/services/dashboard.service.js
const Order = require("../models/order.model");
const User  = require("../models/user.model");

const round2 = (val) => Math.round((val || 0) * 100) / 100;

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/overview
// ──────────────────────────────────────────────────────────────────────────────
exports.getOverview = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [
      totalOrders,
      totalRevenueResult,
      totalCustomersResult,
      totalProductsResult,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalUsers,
      recentOrders,
      revenueTodayResult
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: { $toDouble: "$TotalAmount" } } } }
      ]),
      Order.aggregate([
        { $group: { _id: "$CustomerID" } },
        { $count: "total" }
      ]),
      Order.aggregate([
        { $group: { _id: "$ProductID" } },
        { $count: "total" }
      ]),
      Order.countDocuments({ OrderStatus: /^pending$/i }),
      Order.countDocuments({ OrderStatus: /^delivered$/i }),
      Order.countDocuments({ OrderStatus: /^cancelled$/i }),
      User.countDocuments({}),
      Order.find({})
        .sort({ OrderDate: -1 })
        .limit(5)
        .select("OrderID CustomerName TotalAmount OrderStatus OrderDate")
        .lean(),
      Order.aggregate([
        { $match: { OrderDate: today } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$TotalAmount" } } } }
      ])
    ]);

    return {
      generatedAt: new Date().toISOString(),
      kpis: {
        totalOrders,
        totalRevenue:    round2(totalRevenueResult[0]?.total || 0),
        totalCustomers:  totalCustomersResult[0]?.total || 0,
        totalProducts:   totalProductsResult[0]?.total  || 0,
        totalUsers,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        revenueToday:    round2(revenueTodayResult[0]?.total || 0)
      },
      recentOrders
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/revenue
// ──────────────────────────────────────────────────────────────────────────────
exports.getRevenueDashboard = async () => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const twelveMonthsAgoStr = twelveMonthsAgo.toISOString().split("T")[0];

    const [
      totalsResult,
      revenueByMonthRaw,
      revenueByPaymentMethodRaw,
      topRevenueCategoriesRaw,
      avgOrderValueResult
    ] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id:           null,
            totalRevenue:  { $sum: { $toDouble: "$TotalAmount"    } },
            totalTax:      { $sum: { $toDouble: "$Tax"            } },
            totalDiscount: { $sum: { $toDouble: "$Discount"       } },
            totalShipping: { $sum: { $toDouble: "$ShippingCost"   } }
          }
        }
      ]),
      Order.aggregate([
        { $match: { OrderDate: { $gte: twelveMonthsAgoStr } } },
        {
          $group: {
            _id:     { $substr: ["$OrderDate", 0, 7] },
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orders:  { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { month: "$_id", revenue: 1, orders: 1, _id: 0 } }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:     "$PaymentMethod",
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orders:  { $sum: 1 }
          }
        },
        { $project: { paymentMethod: "$_id", revenue: 1, orders: 1, _id: 0 } }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:     "$Category",
            revenue: { $sum: { $toDouble: "$TotalAmount" } },
            orders:  { $sum: 1 }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $project: { category: "$_id", revenue: 1, orders: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: { _id: null, avg: { $avg: { $toDouble: "$TotalAmount" } } } }
      ])
    ]);

    const stats          = totalsResult[0] || {};
    const totalRevenue   = round2(stats.totalRevenue   || 0);
    const totalTax       = round2(stats.totalTax       || 0);
    const totalDiscount  = round2(stats.totalDiscount  || 0);
    const totalShipping  = round2(stats.totalShipping  || 0);
    const netRevenue     = round2(totalRevenue - totalDiscount);
    const averageOrderValue = round2(avgOrderValueResult[0]?.avg || 0);

    // Month-over-month growth: last month vs previous month
    let monthOverMonthGrowth = 0;
    if (revenueByMonthRaw.length >= 2) {
      const last     = revenueByMonthRaw[revenueByMonthRaw.length - 1].revenue;
      const previous = revenueByMonthRaw[revenueByMonthRaw.length - 2].revenue;
      monthOverMonthGrowth =
        previous > 0 ? round2(((last - previous) / previous) * 100) : 0;
    }

    // Best month
    let bestMonth = null;
    if (revenueByMonthRaw.length > 0) {
      const best = revenueByMonthRaw.reduce((a, b) =>
        b.revenue > a.revenue ? b : a
      );
      bestMonth = { month: best.month, revenue: round2(best.revenue) };
    }

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue,
        totalTax,
        totalDiscount,
        totalShipping,
        netRevenue,
        averageOrderValue,
        monthOverMonthGrowth,
        bestMonth
      },
      revenueByMonth:         revenueByMonthRaw.map((m) => ({ ...m, revenue: round2(m.revenue) })),
      revenueByPaymentMethod: revenueByPaymentMethodRaw.map((p) => ({ ...p, revenue: round2(p.revenue) })),
      topRevenueCategories:   topRevenueCategoriesRaw.map((c) => ({ ...c, revenue: round2(c.revenue) }))
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/orders
// ──────────────────────────────────────────────────────────────────────────────
exports.getOrdersDashboard = async () => {
  try {
    const [
      totalOrders,
      ordersByStatusRaw,
      ordersByMonthRaw,
      dateRangeResult,
      topOrderingCitiesRaw,
      ordersByPaymentMethodRaw,
      recentCancelledOrders,
      deliveredOrdersCount,
      cancelledOrdersCount
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.aggregate([
        { $group: { _id: "$OrderStatus", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:   { $substr: ["$OrderDate", 0, 7] },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { month: "$_id", count: 1, _id: 0 } }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:     null,
            minDate: { $min: "$OrderDate" },
            maxDate: { $max: "$OrderDate" }
          }
        }
      ]),
      Order.aggregate([
        { $group: { _id: "$City", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { city: "$_id", count: 1, _id: 0 } }
      ]),
      Order.aggregate([
        { $group: { _id: "$PaymentMethod", count: { $sum: 1 } } },
        { $project: { paymentMethod: "$_id", count: 1, _id: 0 } }
      ]),
      Order.find({ OrderStatus: /^cancelled$/i })
        .sort({ OrderDate: -1 })
        .limit(5)
        .select("OrderID CustomerName TotalAmount OrderStatus OrderDate")
        .lean(),
      Order.countDocuments({ OrderStatus: /^delivered$/i }),
      Order.countDocuments({ OrderStatus: /^cancelled$/i })
    ]);

    // Average orders per day
    let averageOrdersPerDay = 0;
    if (dateRangeResult.length > 0) {
      const { minDate, maxDate } = dateRangeResult[0];
      const diffMs   = new Date(maxDate) - new Date(minDate);
      const diffDays = diffMs / (1000 * 60 * 60 * 24) || 1;
      averageOrdersPerDay = round2(totalOrders / diffDays);
    }

    const fulfillmentRate  = totalOrders > 0 ? round2((deliveredOrdersCount  / totalOrders) * 100) : 0;
    const cancellationRate = totalOrders > 0 ? round2((cancelledOrdersCount / totalOrders) * 100) : 0;

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalOrders,
        fulfillmentRate,
        cancellationRate,
        averageOrdersPerDay
      },
      ordersByStatus:        ordersByStatusRaw,
      ordersByMonth:         ordersByMonthRaw,
      topOrderingCities:     topOrderingCitiesRaw,
      ordersByPaymentMethod: ordersByPaymentMethodRaw,
      recentCancelledOrders
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/customers
// ──────────────────────────────────────────────────────────────────────────────
exports.getCustomersDashboard = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const [
      totalUniqueCustomersResult,
      topCustomersBySpend,
      topCustomersByOrders,
      customersByCountry,
      newCustomersResult,
      repeatCustomersResult,
      totalOrders
    ] = await Promise.all([
      Order.aggregate([
        { $group: { _id: "$CustomerID" } },
        { $count: "total" }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:          "$CustomerID",
            customerName: { $first: "$CustomerName" },
            totalSpend:   { $sum: { $toDouble: "$TotalAmount" } },
            orderCount:   { $sum: 1 }
          }
        },
        { $sort: { totalSpend: -1 } },
        { $limit: 5 },
        {
          $project: {
            customerID:   "$_id",
            customerName: 1,
            totalSpend:   1,
            orderCount:   1,
            _id:          0
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:          "$CustomerID",
            customerName: { $first: "$CustomerName" },
            orderCount:   { $sum: 1 },
            totalSpend:   { $sum: { $toDouble: "$TotalAmount" } }
          }
        },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        {
          $project: {
            customerID:   "$_id",
            customerName: 1,
            orderCount:   1,
            totalSpend:   1,
            _id:          0
          }
        }
      ]),
      Order.aggregate([
        { $group: { _id: "$Country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { country: "$_id", count: 1, _id: 0 } }
      ]),
      // New customers: first order was within last 30 days
      Order.aggregate([
        {
          $group: {
            _id:         "$CustomerID",
            firstOrder:  { $min: "$OrderDate" }
          }
        },
        { $match: { firstOrder: { $gte: thirtyDaysAgoStr } } },
        { $count: "total" }
      ]),
      // Repeat customers: more than 1 order
      Order.aggregate([
        { $group: { _id: "$CustomerID", orderCount: { $sum: 1 } } },
        { $match: { orderCount: { $gt: 1 } } },
        { $count: "total" }
      ]),
      Order.countDocuments({})
    ]);

    const totalUniqueCustomers = totalUniqueCustomersResult[0]?.total || 0;
    const newCustomers         = newCustomersResult[0]?.total          || 0;
    const repeatCustomers      = repeatCustomersResult[0]?.total       || 0;
    const averageOrdersPerCustomer =
      totalUniqueCustomers > 0 ? round2(totalOrders / totalUniqueCustomers) : 0;

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalUniqueCustomers,
        newCustomers,
        repeatCustomers,
        averageOrdersPerCustomer
      },
      topCustomersBySpend:  topCustomersBySpend.map((c) => ({ ...c, totalSpend: round2(c.totalSpend) })),
      topCustomersByOrders: topCustomersByOrders.map((c) => ({ ...c, totalSpend: round2(c.totalSpend) })),
      customersByCountry
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/dashboard/products
// ──────────────────────────────────────────────────────────────────────────────
exports.getProductsDashboard = async () => {
  try {
    const [
      totalUniqueProductsResult,
      topSellingProducts,
      topRevenueProducts,
      productsByCategory,
      lowSellingProducts,
      avgUnitPriceResult,
      mostDiscountedProducts,
      totalCategoriesResult
    ] = await Promise.all([
      Order.aggregate([
        { $group: { _id: "$ProductID" } },
        { $count: "total" }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:           "$ProductID",
            productName:   { $first: "$ProductName" },
            category:      { $first: "$Category" },
            brand:         { $first: "$Brand" },
            totalQuantity: { $sum: { $toDouble: "$Quantity" } },
            orderCount:    { $sum: 1 }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $project: {
            productID:     "$_id",
            productName:   1,
            category:      1,
            brand:         1,
            totalQuantity: 1,
            orderCount:    1,
            _id:           0
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:          "$ProductID",
            productName:  { $first: "$ProductName" },
            category:     { $first: "$Category" },
            brand:        { $first: "$Brand" },
            totalRevenue: { $sum: { $toDouble: "$TotalAmount" } },
            orderCount:   { $sum: 1 }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
        {
          $project: {
            productID:    "$_id",
            productName:  1,
            category:     1,
            brand:        1,
            totalRevenue: 1,
            orderCount:   1,
            _id:          0
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:             "$Category",
            uniqueProducts:  { $addToSet: "$ProductID" },
            orderCount:      { $sum: 1 }
          }
        },
        { $sort: { orderCount: -1 } },
        {
          $project: {
            category:          "$_id",
            uniqueProductCount: { $size: "$uniqueProducts" },
            orderCount:        1,
            _id:               0
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id:         "$ProductID",
            productName: { $first: "$ProductName" },
            category:    { $first: "$Category" },
            orderCount:  { $sum: 1 }
          }
        },
        { $sort: { orderCount: 1 } },
        { $limit: 5 },
        {
          $project: {
            productID:   "$_id",
            productName: 1,
            category:    1,
            orderCount:  1,
            _id:         0
          }
        }
      ]),
      Order.aggregate([
        { $group: { _id: null, avg: { $avg: { $toDouble: "$UnitPrice" } } } }
      ]),
      Order.aggregate([
        { $match: { Discount: { $gt: "0" } } },
        {
          $group: {
            _id:         "$ProductID",
            productName: { $first: "$ProductName" },
            avgDiscount: { $avg: { $toDouble: "$Discount" } },
            orderCount:  { $sum: 1 }
          }
        },
        { $sort: { avgDiscount: -1 } },
        { $limit: 5 },
        {
          $project: {
            productID:   "$_id",
            productName: 1,
            avgDiscount: 1,
            orderCount:  1,
            _id:         0
          }
        }
      ]),
      Order.aggregate([
        { $group: { _id: "$Category" } },
        { $count: "total" }
      ])
    ]);

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalUniqueProducts: totalUniqueProductsResult[0]?.total || 0,
        averageUnitPrice:    round2(avgUnitPriceResult[0]?.avg   || 0),
        totalCategories:     totalCategoriesResult[0]?.total      || 0
      },
      topSellingProducts,
      topRevenueProducts:    topRevenueProducts.map((p) => ({ ...p, totalRevenue: round2(p.totalRevenue) })),
      productsByCategory,
      lowSellingProducts,
      mostDiscountedProducts: mostDiscountedProducts.map((p) => ({
        ...p,
        avgDiscount: round2(p.avgDiscount)
      }))
    };
  } catch (error) {
    throw error;
  }
};
