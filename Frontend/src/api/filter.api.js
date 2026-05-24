import api from './axios';

export const filterAPI = {
  byStatus:    (type, params)   => api.get('/orders/filter/status', { params: { type, ...params } }),
  byPayment:   (method, params) => api.get('/orders/filter/payment', { params: { method, ...params } }),
  byCategory:  (name, params)   => api.get('/orders/filter/category', { params: { name, ...params } }),
  byBrand:     (name, params)   => api.get('/orders/filter/brand', { params: { name, ...params } }),
  byPrice:     (min, max, params) => api.get('/orders/filter/price', { params: { min, max, ...params } }),
  byDate:      (start, end, params) => api.get('/orders/filter/date', { params: { start, end, ...params } }),
  byCountry:   (name, params)   => api.get('/orders/filter/country', { params: { name, ...params } }),
  byState:     (name, params)   => api.get('/orders/filter/state', { params: { name, ...params } }),
  byCity:      (name, params)   => api.get('/orders/filter/city', { params: { name, ...params } }),
  highValue:   (amount, params) => api.get('/orders/filter/high-value', { params: { amount, ...params } }),
  discounted:  (params)         => api.get('/orders/filter/discounted', { params }),
  cancelled:   (params)         => api.get('/orders/filter/cancelled', { params }),
  refunded:    (params)         => api.get('/orders/filter/refunded', { params }),
  shipped:     (params)         => api.get('/orders/filter/shipped', { params }),
  delivered:   (params)         => api.get('/orders/filter/delivered', { params }),
};
