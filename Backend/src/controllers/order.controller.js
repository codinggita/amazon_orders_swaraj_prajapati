const orderService = require("../services/order.service");

class OrderController {
  async getAllOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || null;
      const q = req.query.q || null;
      const result = await orderService.getAllOrders(page, limit, sort, q);
      res.status(200).json({
        success: true, 
        message: "Orders retrieved successfully",
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve orders",
        error: error.message,
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order retrieved successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve order",
        error: error.message,
      });
    }
  }

  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  }

  async updateOrder(req, res) {
    try {
      const order = await orderService.updateOrder(req.params.orderId, req.body);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to update order",
        error: error.message,
      });
    }
  }

  async patchOrder(req, res) {
    try {
      const order = await orderService.patchOrder(req.params.orderId, req.body);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order partially updated successfully",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to partially update order",
        error: error.message,
      });
    }
  }

  async deleteOrder(req, res) {
    try {
      const order = await orderService.deleteOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete order",
        error: error.message,
      });
    }
  }

  async checkExists(req, res) {
    try {
      const exists = await orderService.checkExists(req.params.orderId);
      res.status(200).json({
        success: true,
        message: "Check order existence",
        data: { exists },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to check order existence",
        error: error.message,
      });
    }
  }

  async getOrderSummary(req, res) {
    try {
      const order = await orderService.getOrderSummary(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order summary retrieved successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve order summary",
        error: error.message,
      });
    }
  }

  async getOrderItems(req, res) {
    try {
      const order = await orderService.getOrderItems(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order items retrieved successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve order items",
        error: error.message,
      });
    }
  }

  async getOrderHistory(req, res) {
    try {
      const history = await orderService.getOrderHistory(req.params.orderId);
      if (history === null) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order history retrieved successfully",
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve order history",
        error: error.message,
      });
    }
  }

  async getOrderInvoice(req, res) {
    try {
      const order = await orderService.getOrderInvoice(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order invoice retrieved successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve order invoice",
        error: error.message,
      });
    }
  }

  async archiveOrder(req, res) {
    try {
      const order = await orderService.archiveOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order archived successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to archive order",
        error: error.message,
      });
    }
  }

  async restoreOrder(req, res) {
    try {
      const order = await orderService.restoreOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order restored successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to restore order",
        error: error.message,
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await orderService.cancelOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to cancel order",
        error: error.message,
      });
    }
  }

  async duplicateOrder(req, res) {
    try {
      const order = await orderService.duplicateOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Original order not found",
        });
      }
      res.status(201).json({
        success: true,
        message: "Order duplicated successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to duplicate order",
        error: error.message,
      });
    }
  }
}

module.exports = new OrderController();
