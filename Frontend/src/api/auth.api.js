import api from './axios';

export const authAPI = {
  login:          (data) => api.post('/auth/login', data),
  register:       (data) => api.post('/auth/register', data),
  logout:         ()     => api.post('/auth/logout'),
  getProfile:     ()     => api.get('/auth/profile'),
  updateProfile:  (data) => api.patch('/auth/profile', data),
  deleteProfile:  ()     => api.delete('/auth/profile'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  verifyEmail:    (data) => api.post('/auth/verify-email', data),
  sendOTP:        (data) => api.post('/auth/send-otp', data),
  verifyOTP:      (data) => api.post('/auth/verify-otp', data),
  getSessions:    ()     => api.get('/auth/sessions'),
  deleteSession:  (id)   => api.delete(`/auth/sessions/${id}`),
  refreshToken:   (data) => api.post('/auth/refresh-token', data),
};
