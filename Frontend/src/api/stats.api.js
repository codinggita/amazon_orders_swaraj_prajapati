import api from './axios';

export const statsAPI = {
  ordersTotal:         () => api.get('/stats/orders/total'),
  ordersDaily:         (params) => api.get('/stats/orders/daily', { params }),
  ordersMonthly:       (params) => api.get('/stats/orders/monthly', { params }),
  ordersYearly:        () => api.get('/stats/orders/yearly'),
  revenueTotal:        () => api.get('/stats/revenue/total'),
  revenueDaily:        (params) => api.get('/stats/revenue/daily', { params }),
  revenueMonthly:      (params) => api.get('/stats/revenue/monthly', { params }),
  revenueYearly:       () => api.get('/stats/revenue/yearly'),
  productsCount:       () => api.get('/stats/products/count'),
  customersCount:      () => api.get('/stats/customers/count'),
  categoriesCount:     () => api.get('/stats/categories/count'),
  refundsCount:        () => api.get('/stats/refunds/count'),
  cancellationsCount:  () => api.get('/stats/cancellations/count'),
  shippingAvgTime:     () => api.get('/stats/shipping/average-time'),
  systemPerformance:   () => api.get('/stats/system/performance'),
};
