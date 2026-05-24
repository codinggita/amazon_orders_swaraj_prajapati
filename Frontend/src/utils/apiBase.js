/** Backend API base — use full URL for OAuth redirects (must hit Express, not Vite). */
export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api/v1';

export const oauthUrl = (provider) => `${API_BASE}/auth/${provider}`;
