import api from './axios';

export const analyticsAPI = {
  revenueTotal:        () => api.get('/analytics/revenue/total'),
  revenueMonthly:      () => api.get('/analytics/revenue/monthly'),
  revenueYearly:       () => api.get('/analytics/revenue/yearly'),
  ordersAvgValue:      () => api.get('/analytics/orders/average-value'),
  ordersCount:         () => api.get('/analytics/orders/count'),
  ordersCancelled:     () => api.get('/analytics/orders/cancelled'),
  ordersRefunded:      () => api.get('/analytics/orders/refunded'),
  topCustomers:        () => api.get('/analytics/customers/top'),
  topSellingProducts:  () => api.get('/analytics/products/top-selling'),
  lowSellingProducts:  () => api.get('/analytics/products/low-selling'),
  topCategories:       () => api.get('/analytics/categories/top'),
  paymentDistribution: () => api.get('/analytics/payments/distribution'),
  topCities:           () => api.get('/analytics/locations/top-cities'),
  returnRate:          () => api.get('/analytics/returns/rate'),
  discountUsage:       () => api.get('/analytics/discounts/usage'),
};
