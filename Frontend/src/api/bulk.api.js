import api from './axios';

export const bulkAPI = {
  create:           (data) => api.post('/orders/bulk/create', data),
  update:           (data) => api.patch('/orders/bulk/update', data),
  delete:           (data) => api.delete('/orders/bulk/delete', { data }),
  updateStatus:     (data) => api.patch('/orders/bulk/status', data),
  archive:          (data) => api.patch('/orders/bulk/archive', data),
  restore:          (data) => api.patch('/orders/bulk/restore', data),
  applyDiscount:    (data) => api.post('/orders/bulk/apply-discount', data),
  updatePayment:    (data) => api.patch('/orders/bulk/payment-status', data),
  updateShipping:   (data) => api.patch('/orders/bulk/shipping-status', data),
  cleanupCancelled: (params) => api.delete('/orders/bulk/cleanup-cancelled', { params }),
};
