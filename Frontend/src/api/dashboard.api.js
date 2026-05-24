import api from './axios';

export const dashboardAPI = {
  overview:   () => api.get('/dashboard/overview'),
  revenue:    () => api.get('/dashboard/revenue'),
  orders:     () => api.get('/dashboard/orders'),
  customers:  () => api.get('/dashboard/customers'),
  products:   () => api.get('/dashboard/products'),
};
