const bulkService = require("../services/bulk.service");

class BulkController {
  async bulkCreate(req, res) {
    try {
      const { orders } = req.body;
      const data = await bulkService.bulkCreate(orders);
      return res.status(201).json({
        success: true,
        message: "Bulk create completed",
        data
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message,
        errors: error.details,
        duplicates: error.duplicates
      });
    }
  }

  async bulkUpdate(req, res) {
    try {
      const { updates } = req.body;
      const data = await bulkService.bulkUpdate(updates);
      return res.status(200).json({
        success: true,
        message: "Bulk update completed",
        data
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkDelete(req, res) {
    try {
      const { orderIDs } = req.body;
      const data = await bulkService.bulkDelete(orderIDs);
      return res.status(200).json({
        success: true,
        message: "Bulk delete completed",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkUpdateStatus(req, res) {
    try {
      const { orderIDs, status, reason } = req.body;
      const data = await bulkService.bulkUpdateStatus(orderIDs, status, reason);
      return res.status(200).json({
        success: true,
        message: "Bulk status update completed",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkArchive(req, res) {
    try {
      const { orderIDs } = req.body;
      const data = await bulkService.bulkArchive(orderIDs);
      return res.status(200).json({
        success: true,
        message: "Bulk archive completed",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkRestore(req, res) {
    try {
      const { orderIDs } = req.body;
      const data = await bulkService.bulkRestore(orderIDs);
      return res.status(200).json({
        success: true,
        message: "Bulk restore completed",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkApplyDiscount(req, res) {
    try {
      const { orderIDs, discountPercent, reason } = req.body;
      const data = await bulkService.bulkApplyDiscount(orderIDs, discountPercent, reason);
      return res.status(200).json({
        success: true,
        message: "Bulk discount applied successfully",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkUpdatePaymentStatus(req, res) {
    try {
      const { orderIDs, paymentMethod } = req.body;
      const data = await bulkService.bulkUpdatePaymentStatus(orderIDs, paymentMethod);
      return res.status(200).json({
        success: true,
        message: "Bulk payment status update completed",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkUpdateShippingStatus(req, res) {
    try {
      const { orderIDs, shippingStatus, carrier, trackingNote } = req.body;
      const data = await bulkService.bulkUpdateShippingStatus(orderIDs, shippingStatus, carrier, trackingNote);
      return res.status(200).json({
        success: true,
        message: "Bulk shipping status update completed",
        data
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async cleanupCancelled(req, res) {
    try {
      const { before } = req.query;
      const data = await bulkService.cleanupCancelled(before);
      const message = data.deleted > 0 
        ? "Cancelled orders cleaned up successfully" 
        : "No cancelled orders found to clean up";
        
      return res.status(200).json({
        success: true,
        message,
        data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BulkController();
