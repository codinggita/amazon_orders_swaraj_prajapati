// src/middlewares/headOptions.middleware.js
//
// Reusable header-setting helpers shared by all HEAD and OPTIONS route handlers.
// HEAD  handlers call setStandardHeadHeaders()  then res.status(code).end()
// OPTIONS handlers call setStandardOptionsHeaders() then res.status(204).end()

// ──────────────────────────────────────────────────────────────────────────────
// Standard HEAD response headers
// ──────────────────────────────────────────────────────────────────────────────
const setStandardHeadHeaders = (res, extraHeaders = {}) => {
  res.set({
    "Content-Type":          "application/json",
    "X-API-Version":         "1.0.0",
    "X-Powered-By":          "Amazon Orders API",
    "X-Request-ID":          Date.now().toString(),
    "X-Timestamp":           new Date().toISOString(),
    "Cache-Control":         "no-cache, no-store, must-revalidate",
    "X-RateLimit-Limit":     "100",
    "X-RateLimit-Remaining": "99",
    "X-RateLimit-Reset":     new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    ...extraHeaders
  });
};

// ──────────────────────────────────────────────────────────────────────────────
// Standard OPTIONS response headers
// ──────────────────────────────────────────────────────────────────────────────
const setStandardOptionsHeaders = (res, allowedMethods, extraHeaders = {}) => {
  res.set({
    "Allow":                         allowedMethods,
    "Access-Control-Allow-Origin":   "*",
    "Access-Control-Allow-Methods":  allowedMethods,
    "Access-Control-Allow-Headers":  "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Max-Age":        "86400",
    "Access-Control-Expose-Headers": "X-Total-Count, X-Page, X-Limit, X-Total-Pages",
    "X-API-Version":                 "1.0.0",
    "X-Timestamp":                   new Date().toISOString(),
    ...extraHeaders
  });
};

module.exports = { setStandardHeadHeaders, setStandardOptionsHeaders };
