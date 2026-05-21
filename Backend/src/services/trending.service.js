// src/services/trending.service.js
const Order = require("../models/order.model");

const round2 = (val) => Math.round((val || 0) * 100) / 100;

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/trending/products
// ──────────────────────────────────────────────────────────────────────────────
exports.getTrendingProducts = async (query) => {
  try {
    const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
    const category = query.category || null;

    const pipeline = [];

    // Optional category filter before group
    if (category) {
      pipeline.push({ $match: { Category: new RegExp(category, "i") } });
    }

    pipeline.push(
      {
        $group: {
          _id: "$ProductID",
          productName:   { $first: "$ProductName" },
          category:      { $first: "$Category" },
          brand:         { $first: "$Brand" },
          unitPrice:     { $first: "$UnitPrice" },
          orderCount:    { $sum: 1 },
          totalQuantity: { $sum: { $toDouble: "$Quantity" } },
          totalRevenue:  { $sum: { $toDouble: "$TotalAmount" } }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: limit }
    );

    // Run aggregation and total order count in parallel
    const [results, totalOrders] = await Promise.all([
      Order.aggregate(pipeline),
      Order.countDocuments({})
    ]);

    const trending = results.map((item, index) => ({
      trendingRank:  index + 1,
      productID:     item._id,
      productName:   item.productName,
      category:      item.category,
      brand:         item.brand,
      unitPrice:     item.unitPrice,
      orderCount:    item.orderCount,
      totalQuantity: item.totalQuantity,
      totalRevenue:  round2(item.totalRevenue),
      trendingScore:
        totalOrders > 0
          ? Math.round((item.orderCount / totalOrders) * 1000) / 10
          : 0
    }));

    return {
      generatedAt: new Date().toISOString(),
      totalProductsAnalyzed: results.length,
      trending
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/trending/categories
// ──────────────────────────────────────────────────────────────────────────────
exports.getTrendingCategories = async (query) => {
  try {
    const limit = Math.min(parseInt(query.limit, 10) || 10, 20);

    const results = await Order.aggregate([
      {
        $group: {
          _id:           "$Category",
          orderCount:    { $sum: 1 },
          totalRevenue:  { $sum: { $toDouble: "$TotalAmount" } },
          totalQuantity: { $sum: { $toDouble: "$Quantity" } },
          uniqueProducts:{ $addToSet: "$ProductID" },
          uniqueBrands:  { $addToSet: "$Brand" }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: limit }
    ]);

    const trending = results.map((item, index) => {
      const rank = index + 1;
      let growthIndicator;
      if (rank <= 3)       growthIndicator = "🔥 Hot";
      else if (rank <= 6)  growthIndicator = "📈 Rising";
      else                 growthIndicator = "📊 Stable";

      return {
        trendingRank:       rank,
        category:           item._id,
        orderCount:         item.orderCount,
        totalRevenue:       round2(item.totalRevenue),
        totalQuantity:      item.totalQuantity,
        uniqueProductCount: item.uniqueProducts.length,
        uniqueBrandCount:   item.uniqueBrands.length,
        growthIndicator
        // uniqueProducts and uniqueBrands arrays intentionally omitted
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      trending
    };
  } catch (error) {
    throw error;
  }
};
