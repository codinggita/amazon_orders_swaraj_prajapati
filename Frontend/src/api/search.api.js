import api from './axios';

export const searchAPI = {
  global:       (q, params) => api.get('/orders/search', { params: { q, ...params } }),
  byCustomer:   (q, params) => api.get('/orders/search/customer', { params: { q, ...params } }),
  byProduct:    (q, params) => api.get('/orders/search/product', { params: { q, ...params } }),
  byCategory:   (q, params) => api.get('/orders/search/category', { params: { q, ...params } }),
  byBrand:      (q, params) => api.get('/orders/search/brand', { params: { q, ...params } }),
  byStatus:     (q, params) => api.get('/orders/search/status', { params: { q, ...params } }),
  byPayment:    (q, params) => api.get('/orders/search/payment', { params: { q, ...params } }),
  byLocation:   (q, params) => api.get('/orders/search/location', { params: { q, ...params } }),
  byDate:       (q, params) => api.get('/orders/search/date', { params: { q, ...params } }),
  byTracking:   (q, params) => api.get('/orders/search/tracking', { params: { q, ...params } }),
  fuzzy:        (q, params) => api.get('/orders/search/fuzzy', { params: { q, ...params } }),
  autocomplete: (q)         => api.get('/orders/search/autocomplete', { params: { q } }),
  highlight:    (q, params) => api.get('/orders/search/highlight', { params: { q, ...params } }),
  recent:       ()           => api.get('/orders/search/recent'),
  popular:      ()           => api.get('/orders/search/popular'),
};
