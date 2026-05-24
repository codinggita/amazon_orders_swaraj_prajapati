import api from './axios';

export const trendingAPI = {
  products:   (params) => api.get('/trending/products', { params }),
  categories: (params) => api.get('/trending/categories', { params }),
};
