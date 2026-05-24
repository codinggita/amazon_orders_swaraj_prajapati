import api from './axios';

export const adminAPI = {
  getUsers:          (params) => api.get('/admin/users', { params }),
  getUserById:       (id)     => api.get(`/admin/users/${id}`),
  banUser:           (id)     => api.patch(`/admin/users/${id}/ban`),
  unbanUser:         (id)     => api.patch(`/admin/users/${id}/unban`),
  changeUserRole:    (id, data) => api.patch(`/admin/users/${id}/role`, data),
  getOrders:         (params) => api.get('/admin/orders', { params }),
  getSalesReport:    ()       => api.get('/admin/reports/sales'),
  getRevenueReport:  ()       => api.get('/admin/reports/revenue'),
  clearCache:        ()       => api.delete('/admin/cache/clear'),
  getSystemHealth:   ()       => api.get('/admin/system/health'),
  getLogs:           (params) => api.get('/admin/system/logs', { params }),
  setMaintenance:    (data)   => api.post('/admin/system/maintenance', data),
  getBackups:        ()       => api.get('/admin/backups'),
};
