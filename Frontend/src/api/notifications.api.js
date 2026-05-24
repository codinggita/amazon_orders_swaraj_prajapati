import api from './axios';

export const notificationsAPI = {
  getAll:  (params) => api.get('/notifications', { params }),
  markRead: (id)    => api.patch(`/notifications/read/${id}`),
  delete:   (id)    => api.delete(`/notifications/${id}`),
};
