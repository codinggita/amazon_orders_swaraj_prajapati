const Order = require("../models/order.model");

// SHARED VALIDATION HELPERS
const VALID_ORDER_STATUSES = [
  "Pending", "Shipped", "Out for Delivery",
  "Delivered", "Cancelled", "Refunded", "Returned"
];

const VALID_PAYMENT_METHODS = [
  "UPI", "Debit Card", "Credit Card",
  "Net Banking", "COD", "Wallet"
];

const VALID_SHIPPING_STATUSES = [
  "Pending", "Shipped", "Out for Delivery",
  "Delivered", "Returned", "Cancelled"
];

const validateOrderIDs = (orderIDs, max = 500) => {
  if (!Array.isArray(orderIDs) || orderIDs.length === 0) {
    return "orderIDs must be a non-empty array";
  }
  if (orderIDs.length > max) {
    return `Maximum ${max} orders allowed per bulk operation`;
  }
  if (orderIDs.some(id => typeof id !== "string" || id.trim() === "")) {
    return "All orderIDs must be non-empty strings";
  }
  return null; // null means valid
};

class BulkService {
  /**
   * Bulk create multiple orders in one operation
   */
  async bulkCreate(orders) {
    try {
      if (!Array.isArray(orders) || orders.length === 0) {
        throw new Error("orders must be a non-empty array");
      }
      if (orders.length > 500) {
        throw new Error("Maximum 500 orders allowed per bulk create");
      }

      const errors = [];
      const orderIDs = new Set();
      const duplicateIDsInReq = new Set();

      orders.forEach((order, index) => {
        const itemErrors = [];
        if (!order.OrderID) itemErrors.push("OrderID is required");
        if (!order.CustomerName) itemErrors.push("CustomerName is required");
        if (!order.ProductName) itemErrors.push("ProductName is required");
        if (!order.TotalAmount) itemErrors.push("TotalAmount is required");

        if (itemErrors.length > 0) {
          errors.push({ index, message: itemErrors.join(", ") });
        }

        if (order.OrderID) {
          if (orderIDs.has(order.OrderID)) {
            duplicateIDsInReq.add(order.OrderID);
          }
          orderIDs.add(order.OrderID);
        }
      });

      if (errors.length > 0) {
        const err = new Error("Validation failed");
        err.details = errors;
        err.status = 400;
        throw err;
      }

      if (duplicateIDsInReq.size > 0) {
        const err = new Error("Duplicate OrderIDs found in request");
        err.duplicates = Array.from(duplicateIDsInReq);
        err.status = 409;
        throw err;
      }

      const allOrderIDs = Array.from(orderIDs);
      const existingOrders = await Order.find({ OrderID: { $in: allOrderIDs } }).select("OrderID").lean();
      if (existingOrders.length > 0) {
        const err = new Error("Duplicate OrderIDs found in database");
        err.duplicates = existingOrders.map(o => o.OrderID);
        err.status = 409;
        throw err;
      }

      const result = await Order.insertMany(orders, { ordered: false });
      
      return {
        requested: orders.length,
        created: result.length,
        failed: 0,
        createdOrders: result.map(o => o.OrderID),
        failedOrders: []
      };
    } catch (error) {
      if (error.name === "BulkWriteError" || error.name === "MongoBulkWriteError") {
        const createdCount = error.result.nInserted;
        const writeErrors = error.writeErrors || [];
        const failedOrders = writeErrors.map(we => ({
          orderID: orders[we.index].OrderID,
          reason: we.errmsg
        }));

        return {
          requested: orders.length,
          created: createdCount,
          failed: writeErrors.length,
          createdOrders: orders.filter((_, i) => !writeErrors.some(we => we.index === i)).map(o => o.OrderID),
          failedOrders
        };
      }
      throw error;
    }
  }

  /**
   * Bulk update multiple orders
   */
  async bulkUpdate(updates) {
    try {
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error("updates must be a non-empty array");
      }
      if (updates.length > 200) {
        throw new Error("Maximum 200 updates allowed per bulk operation");
      }

      const bulkOps = updates.map(({ orderID, fields }) => {
        if (!orderID || !fields || Object.keys(fields).length === 0) {
          throw new Error("Each update must have orderID and non-empty fields");
        }

        // Silently remove protected fields
        const { OrderID, _id, statusHistory, ...cleanFields } = fields;

        return {
          updateOne: {
            filter: { OrderID: orderID },
            update: { $set: cleanFields }
          }
        };
      });

      const result = await Order.bulkWrite(bulkOps, { ordered: false });

      return {
        requested: updates.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
        notFound: updates.length - result.matchedCount,
        details: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          upsertedCount: result.upsertedCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk delete multiple orders
   */
  async bulkDelete(orderIDs) {
    try {
      const validationError = validateOrderIDs(orderIDs, 100);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      const found = await Order.find({ OrderID: { $in: orderIDs } }).select("OrderID").lean();
      const foundIDs = found.map(o => o.OrderID);
      const notFoundIDs = orderIDs.filter(id => !foundIDs.includes(id));

      const result = await Order.deleteMany({ OrderID: { $in: foundIDs } });

      return {
        requested: orderIDs.length,
        deleted: result.deletedCount,
        notFound: notFoundIDs.length,
        deletedOrderIDs: foundIDs,
        notFoundOrderIDs: notFoundIDs
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk update OrderStatus for multiple orders
   */
  async bulkUpdateStatus(orderIDs, status, reason) {
    try {
      const validationError = validateOrderIDs(orderIDs, 500);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      if (!VALID_ORDER_STATUSES.includes(status)) {
        const err = new Error(`Invalid status. Allowed values: ${VALID_ORDER_STATUSES.join(", ")}`);
        err.status = 400;
        throw err;
      }

      const bulkOps = orderIDs.map(id => ({
        updateOne: {
          filter: { OrderID: id },
          update: {
            $set: { OrderStatus: status },
            $push: { statusHistory: { status, changedAt: new Date(), reason: reason || "" } }
          }
        }
      }));

      const result = await Order.bulkWrite(bulkOps, { ordered: false });

      return {
        requested: orderIDs.length,
        updated: result.modifiedCount,
        notFound: orderIDs.length - result.matchedCount,
        newStatus: status,
        details: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk archive multiple orders
   */
  async bulkArchive(orderIDs) {
    try {
      const validationError = validateOrderIDs(orderIDs, 500);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      const result = await Order.updateMany(
        { OrderID: { $in: orderIDs }, isArchived: false },
        { $set: { isArchived: true } }
      );

      return {
        requested: orderIDs.length,
        archived: result.modifiedCount,
        alreadyArchived: result.matchedCount - result.modifiedCount,
        details: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk restore multiple archived orders
   */
  async bulkRestore(orderIDs) {
    try {
      const validationError = validateOrderIDs(orderIDs, 500);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      const result = await Order.updateMany(
        { OrderID: { $in: orderIDs }, isArchived: true },
        { $set: { isArchived: false } }
      );

      return {
        requested: orderIDs.length,
        restored: result.modifiedCount,
        notArchived: orderIDs.length - result.matchedCount,
        details: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply a discount percentage to multiple orders
   */
  async bulkApplyDiscount(orderIDs, discountPercent, reason) {
    try {
      const validationError = validateOrderIDs(orderIDs, 200);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      if (typeof discountPercent !== "number" || discountPercent < 0.01 || discountPercent > 100) {
        const err = new Error("discountPercent must be a number between 0.01 and 100");
        err.status = 400;
        throw err;
      }

      const orders = await Order.find({ OrderID: { $in: orderIDs } }).lean();
      
      let totalOriginalAmount = 0;
      let totalDiscountGiven = 0;
      let totalNewAmount = 0;

      const bulkOps = orders.map(order => {
        const originalAmount = parseFloat(order.TotalAmount) || 0;
        const discountAmount = parseFloat(((discountPercent / 100) * originalAmount).toFixed(2));
        const newTotal = parseFloat((originalAmount - discountAmount).toFixed(2));
        const newDiscount = parseFloat(
          (parseFloat(order.Discount || "0") + discountAmount).toFixed(2)
        );

        totalOriginalAmount += originalAmount;
        totalDiscountGiven += discountAmount;
        totalNewAmount += newTotal;

        return {
          updateOne: {
            filter: { OrderID: order.OrderID },
            update: {
              $set: {
                Discount: newDiscount.toString(),
                TotalAmount: newTotal.toString()
              },
              $push: {
                statusHistory: {
                  status: "Discount Applied",
                  changedAt: new Date(),
                  discountPercent,
                  discountAmount,
                  reason: reason || ""
                }
              }
            }
          }
        };
      });

      const result = await Order.bulkWrite(bulkOps, { ordered: false });

      return {
        requested: orderIDs.length,
        updated: result.modifiedCount,
        notFound: orderIDs.length - orders.length,
        discountPercent,
        summary: {
          totalOriginalAmount: parseFloat(totalOriginalAmount.toFixed(2)),
          totalDiscountGiven: parseFloat(totalDiscountGiven.toFixed(2)),
          totalNewAmount: parseFloat(totalNewAmount.toFixed(2))
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk update PaymentMethod for multiple orders
   */
  async bulkUpdatePaymentStatus(orderIDs, paymentMethod) {
    try {
      const validationError = validateOrderIDs(orderIDs, 500);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
        const err = new Error(`Invalid paymentMethod. Allowed values: ${VALID_PAYMENT_METHODS.join(", ")}`);
        err.status = 400;
        throw err;
      }

      const result = await Order.updateMany(
        { OrderID: { $in: orderIDs } },
        {
          $set: { PaymentMethod: paymentMethod },
          $push: { statusHistory: { status: "Payment Method Updated", changedAt: new Date() } }
        }
      );

      return {
        requested: orderIDs.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
        newPaymentMethod: paymentMethod,
        details: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk update shipping status
   */
  async bulkUpdateShippingStatus(orderIDs, shippingStatus, carrier, trackingNote) {
    try {
      const validationError = validateOrderIDs(orderIDs, 500);
      if (validationError) {
        const err = new Error(validationError);
        err.status = 400;
        throw err;
      }

      if (!VALID_SHIPPING_STATUSES.includes(shippingStatus)) {
        const err = new Error(`Invalid shippingStatus. Allowed values: ${VALID_SHIPPING_STATUSES.join(", ")}`);
        err.status = 400;
        throw err;
      }

      const statusEntry = {
        status: shippingStatus,
        changedAt: new Date(),
        carrier: carrier || "Not specified",
        trackingNote: trackingNote || ""
      };

      const bulkOps = orderIDs.map(id => ({
        updateOne: {
          filter: { OrderID: id },
          update: {
            $set: { OrderStatus: shippingStatus },
            $push: { statusHistory: statusEntry }
          }
        }
      }));

      const result = await Order.bulkWrite(bulkOps, { ordered: false });

      return {
        requested: orderIDs.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
        newShippingStatus: shippingStatus,
        carrier: carrier || "Not specified",
        details: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Permanently delete ALL cancelled orders
   */
  async cleanupCancelled(before) {
    try {
      const query = { OrderStatus: /^cancelled$/i };
      if (before) {
        query.OrderDate = { $lte: before };
      }

      const countToDelete = await Order.countDocuments(query);
      if (countToDelete === 0) {
        return { deleted: 0 };
      }

      const result = await Order.deleteMany(query);

      return {
        deleted: result.deletedCount,
        filter: {
          status: "Cancelled",
          before: before || null
        },
        cleanedAt: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BulkService();
