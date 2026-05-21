// src/services/recommendations.service.js
const Order = require("../models/order.model");

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/recommendations/products/:customerId
// ──────────────────────────────────────────────────────────────────────────────
exports.getProductRecommendations = async (customerId) => {
  try {
    // STEP 1: Fetch customer's past orders
    const orders = await Order.find({ CustomerID: customerId }).lean();

    if (!orders || orders.length === 0) {
      return {
        customerID: customerId,
        basedOn: {
          totalOrdersAnalyzed: 0,
          categories: [],
          brands: []
        },
        recommendations: [],
        totalRecommendations: 0,
        message: "No order history found for recommendations"
      };
    }

    // STEP 2: Extract purchased categories, brands, and product IDs
    const categories = [...new Set(orders.map((o) => o.Category).filter(Boolean))];
    const brands = [...new Set(orders.map((o) => o.Brand).filter(Boolean))];
    const boughtProductIDs = orders.map((o) => o.ProductID).filter(Boolean);

    // STEP 3: Find other orders matching same categories or brands
    //         that have products this customer has NOT bought
    const relatedOrders = await Order.find({
      $or: [
        { Category: { $in: categories } },
        { Brand: { $in: brands } }
      ],
      ProductID: { $nin: boughtProductIDs }
    })
      .select("ProductID ProductName Category Brand UnitPrice")
      .lean();

    // STEP 4: Deduplicate by ProductID – keep first occurrence
    const seen = new Map();
    for (const item of relatedOrders) {
      if (item.ProductID && !seen.has(item.ProductID)) {
        seen.set(item.ProductID, item);
      }
    }

    // STEP 5: Sort by UnitPrice descending, limit to 10
    const deduplicated = [...seen.values()].sort(
      (a, b) => parseFloat(b.UnitPrice) - parseFloat(a.UnitPrice)
    );
    const top10 = deduplicated.slice(0, 10);

    // Build recommendations with reason
    const recommendations = top10.map((product) => {
      const catMatch = categories.includes(product.Category);
      const brandMatch = brands.includes(product.Brand);

      let recommendationReason;
      if (catMatch && brandMatch) {
        recommendationReason = `Based on your interest in ${product.Category} from ${product.Brand}`;
      } else if (catMatch) {
        recommendationReason = `Based on your interest in ${product.Category}`;
      } else {
        recommendationReason = `Popular in brands you like: ${product.Brand}`;
      }

      return {
        productID: product.ProductID,
        productName: product.ProductName,
        category: product.Category,
        brand: product.Brand,
        unitPrice: parseFloat(product.UnitPrice || "0").toFixed(2),
        recommendationReason
      };
    });

    return {
      customerID: customerId,
      basedOn: {
        totalOrdersAnalyzed: orders.length,
        categories,
        brands
      },
      recommendations,
      totalRecommendations: recommendations.length
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/recommendations/orders/:orderId
// ──────────────────────────────────────────────────────────────────────────────
exports.getOrderRecommendations = async (orderId) => {
  try {
    // STEP 1: Fetch the order
    const order = await Order.findOne({ OrderID: orderId }).lean();

    if (!order) {
      return null; // controller will handle 404
    }

    // STEP 2: Find products with same Category OR same Brand, excluding same ProductID
    const relatedOrders = await Order.find({
      $or: [
        { Category: order.Category },
        { Brand: order.Brand }
      ],
      ProductID: { $ne: order.ProductID }
    })
      .select("ProductID ProductName Category Brand UnitPrice TotalAmount")
      .lean();

    // STEP 3: Deduplicate by ProductID
    const seen = new Map();
    for (const item of relatedOrders) {
      if (item.ProductID && !seen.has(item.ProductID)) {
        seen.set(item.ProductID, item);
      }
    }

    // STEP 4: Score each product and sort
    const scored = [...seen.values()].map((product) => {
      let score = 0;
      if (product.Category === order.Category) score += 2;
      if (product.Brand === order.Brand) score += 3;

      let matchReason;
      if (score === 5) matchReason = "Same category and brand";
      else if (score === 3) matchReason = "Same brand";
      else if (score === 2) matchReason = "Same category";
      else matchReason = "You may also like";

      return {
        productID: product.ProductID,
        productName: product.ProductName,
        category: product.Category,
        brand: product.Brand,
        unitPrice: parseFloat(product.UnitPrice || "0").toFixed(2),
        similarityScore: score,
        matchReason
      };
    });

    // Sort by score desc, then by unitPrice desc, limit to 8
    scored.sort((a, b) => {
      if (b.similarityScore !== a.similarityScore) return b.similarityScore - a.similarityScore;
      return parseFloat(b.unitPrice) - parseFloat(a.unitPrice);
    });
    const top8 = scored.slice(0, 8);

    return {
      sourceOrder: {
        orderID: order.OrderID,
        productName: order.ProductName,
        category: order.Category,
        brand: order.Brand
      },
      recommendations: top8,
      totalRecommendations: top8.length
    };
  } catch (error) {
    throw error;
  }
};
