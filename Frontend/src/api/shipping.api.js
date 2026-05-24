import api from './axios';

export const shippingAPI = {
  track:           (orderId)       => api.get(`/shipping/tracking/${orderId}`),
  updateStatus:    (orderId, data) => api.patch(`/shipping/update-status/${orderId}`, data),
  getPending:      (params)        => api.get('/shipping/pending', { params }),
  getDelivered:    (params)        => api.get('/shipping/delivered', { params }),
  getReturned:     (params)        => api.get('/shipping/returned', { params }),
  createLabel:     (data)          => api.post('/shipping/create-label', data),
  getEstimate:     (orderId)       => api.get(`/shipping/estimate/${orderId}`),
  getCarriers:     ()              => api.get('/shipping/carriers'),
  changeAddress:   (orderId, data) => api.patch(`/shipping/change-address/${orderId}`, data),
  reschedule:      (orderId, data) => api.post(`/shipping/reschedule/${orderId}`, data),
};
