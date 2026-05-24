import api from './axios';

export const sortAPI = {
  highestValue: (params) => api.get('/orders/sort/highest-value', { params }),
  lowestValue:  (params) => api.get('/orders/sort/lowest-value', { params }),
  latest:       (params) => api.get('/orders/sort/latest', { params }),
  oldest:       (params) => api.get('/orders/sort/oldest', { params }),
  mostItems:    (params) => api.get('/orders/sort/most-items', { params }),
  leastItems:   (params) => api.get('/orders/sort/least-items', { params }),
  discount:     (params) => api.get('/orders/sort/discount', { params }),
};
