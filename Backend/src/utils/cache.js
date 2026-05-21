// src/utils/cache.js
// Shared in-memory cache (Map) used by admin.service.js and system.service.js.
// In production this would be replaced by Redis or a similar caching layer.

const appCache = new Map();

module.exports = appCache;
