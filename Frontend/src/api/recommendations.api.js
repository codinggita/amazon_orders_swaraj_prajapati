import api from './axios';

export const recommendationsAPI = {
  byCustomer: (customerId) => api.get(`/recommendations/products/${customerId}`),
  byOrder:    (orderId)    => api.get(`/recommendations/orders/${orderId}`),
};
