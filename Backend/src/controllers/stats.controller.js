const statsService = require("../services/stats.service");

class StatsController {
  async getTotalOrderStats(req, res) {
    try {
      const data = await statsService.getTotalOrderStats();
      return res.status(200).json({
        success: true,
        message: "Total order statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching total order statistics",
        error: error.message,
      });
    }
  }

  async getDailyOrderStats(req, res) {
    try {
      const { start, end } = req.query;
      const data = await statsService.getDailyOrderStats(start, end);
      return res.status(200).json({
        success: true,
        message: "Daily order statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching daily order statistics",
        error: error.message,
      });
    }
  }

  async getMonthlyOrderStats(req, res) {
    try {
      const { year } = req.query;
      const data = await statsService.getMonthlyOrderStats(year);
      return res.status(200).json({
        success: true,
        message: "Monthly order statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching monthly order statistics",
        error: error.message,
      });
    }
  }

  async getYearlyOrderStats(req, res) {
    try {
      const data = await statsService.getYearlyOrderStats();
      return res.status(200).json({
        success: true,
        message: "Yearly order statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching yearly order statistics",
        error: error.message,
      });
    }
  }

  async getTotalRevenueStats(req, res) {
    try {
      const data = await statsService.getTotalRevenueStats();
      return res.status(200).json({
        success: true,
        message: "Total revenue statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching total revenue statistics",
        error: error.message,
      });
    }
  }

  async getDailyRevenueStats(req, res) {
    try {
      const { start, end } = req.query;
      const data = await statsService.getDailyRevenueStats(start, end);
      return res.status(200).json({
        success: true,
        message: "Daily revenue statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching daily revenue statistics",
        error: error.message,
      });
    }
  }

  async getMonthlyRevenueStats(req, res) {
    try {
      const { year } = req.query;
      const data = await statsService.getMonthlyRevenueStats(year);
      return res.status(200).json({
        success: true,
        message: "Monthly revenue statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching monthly revenue statistics",
        error: error.message,
      });
    }
  }

  async getYearlyRevenueStats(req, res) {
    try {
      const data = await statsService.getYearlyRevenueStats();
      return res.status(200).json({
        success: true,
        message: "Yearly revenue statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching yearly revenue statistics",
        error: error.message,
      });
    }
  }

  async getProductStats(req, res) {
    try {
      const data = await statsService.getProductStats();
      return res.status(200).json({
        success: true,
        message: "Product count statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching product statistics",
        error: error.message,
      });
    }
  }

  async getCustomerStats(req, res) {
    try {
      const data = await statsService.getCustomerStats();
      return res.status(200).json({
        success: true,
        message: "Customer count statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching customer statistics",
        error: error.message,
      });
    }
  }

  async getCustomersList(req, res) {
    try {
      const { q, page, limit } = req.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const data = await statsService.getCustomersList(q, pageNum, limitNum);
      return res.status(200).json({
        success: true,
        message: "Customer list fetched successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching customer list",
        error: error.message,
      });
    }
  }

  async getCategoryStats(req, res) {
    try {
      const data = await statsService.getCategoryStats();
      return res.status(200).json({
        success: true,
        message: "Category count statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching category statistics",
        error: error.message,
      });
    }
  }

  async getRefundStats(req, res) {
    try {
      const data = await statsService.getRefundStats();
      return res.status(200).json({
        success: true,
        message: "Refund count statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching refund statistics",
        error: error.message,
      });
    }
  }

  async getCancellationStats(req, res) {
    try {
      const data = await statsService.getCancellationStats();
      return res.status(200).json({
        success: true,
        message: "Cancellation count statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching cancellation statistics",
        error: error.message,
      });
    }
  }

  async getShippingStats(req, res) {
    try {
      const data = await statsService.getShippingStats();
      return res.status(200).json({
        success: true,
        message: "Shipping statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching shipping statistics",
        error: error.message,
      });
    }
  }

  async getSystemPerformanceStats(req, res) {
    try {
      const data = await statsService.getSystemPerformanceStats();
      return res.status(200).json({
        success: true,
        message: "System performance statistics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching system performance statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new StatsController();
