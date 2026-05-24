import api from './axios';

export const systemAPI = {
  version:         () => api.get('/system/version'),
  config:          () => api.get('/system/config'),
  uptime:          () => api.get('/system/uptime'),
  ping:            () => api.get('/system/ping'),
  dbStatus:        () => api.get('/system/status/database'),
  cacheStatus:     () => api.get('/system/status/cache'),
  storageStatus:   () => api.get('/system/status/storage'),
};
