// src/services/activity.service.js

// ──────────────────────────────────────────────────────────────────────────────
// IN-MEMORY STORE – persists across requests in the same process
// Seeded with 8 sample activity log entries
// ──────────────────────────────────────────────────────────────────────────────
const now = Date.now();

const activityLogs = [
  {
    id: "8",
    action: "CACHE_CLEARED",
    entity: "System",
    details: { clearedBy: "admin@example.com" },
    timestamp: new Date(now - 1  * 60 * 1000).toISOString()          // 1 min ago
  },
  {
    id: "7",
    action: "BULK_STATUS_UPDATE",
    entity: "Order",
    details: { count: 50, newStatus: "Shipped" },
    timestamp: new Date(now - 5  * 60 * 1000).toISOString()          // 5 min ago
  },
  {
    id: "6",
    action: "ORDER_CANCELLED",
    entity: "Order",
    details: { orderID: "ORD0000003", reason: "Customer request" },
    timestamp: new Date(now - 15 * 60 * 1000).toISOString()          // 15 min ago
  },
  {
    id: "5",
    action: "USER_REGISTERED",
    entity: "User",
    details: { name: "Test User", email: "test@example.com" },
    timestamp: new Date(now - 30 * 60 * 1000).toISOString()          // 30 min ago
  },
  {
    id: "4",
    action: "PAYMENT_RECEIVED",
    entity: "Payment",
    details: { orderID: "ORD0000001", amount: "319.86" },
    timestamp: new Date(now - 1  * 60 * 60 * 1000).toISOString()     // 1 hr ago
  },
  {
    id: "3",
    action: "ORDER_SHIPPED",
    entity: "Order",
    details: { orderID: "ORD0000002", carrier: "FedEx" },
    timestamp: new Date(now - 2  * 60 * 60 * 1000).toISOString()     // 2 hr ago
  },
  {
    id: "2",
    action: "USER_LOGIN",
    entity: "User",
    details: { email: "admin@example.com", ip: "192.168.1.1" },
    timestamp: new Date(now - 6  * 60 * 60 * 1000).toISOString()     // 6 hr ago
  },
  {
    id: "1",
    action: "ORDER_CREATED",
    entity: "Order",
    details: { orderID: "ORD0000001", customer: "Vihaan Sharma" },
    timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString()     // 12 hr ago
  }
];

let logIdCounter = 9;

// ──────────────────────────────────────────────────────────────────────────────
// Helper: record a new activity log from other services
// ──────────────────────────────────────────────────────────────────────────────
const addActivityLog = (action, entity, details = {}) => {
  activityLogs.unshift({
    id: (logIdCounter++).toString(),
    action,
    entity,
    details,
    timestamp: new Date().toISOString()
  });
  if (activityLogs.length > 1000) activityLogs.pop();
};
module.exports.addActivityLog = addActivityLog;

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/activity/logs
// ──────────────────────────────────────────────────────────────────────────────
exports.getActivityLogs = (query) => {
  try {
    const limit  = Math.min(parseInt(query.limit, 10) || 50, 200);
    const page   = parseInt(query.page, 10) || 1;
    const action = query.action  || null;
    const entity = query.entity  || null;
    const search = query.search  || null;

    // Filter in JS – logs are already newest-first from unshift
    let filtered = [...activityLogs];

    if (action) {
      filtered = filtered.filter((log) =>
        log.action.toLowerCase().includes(action.toLowerCase())
      );
    }
    if (entity) {
      filtered = filtered.filter((log) =>
        log.entity.toLowerCase() === entity.toLowerCase()
      );
    }
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((log) =>
        JSON.stringify(log.details).toLowerCase().includes(term)
      );
    }

    const total      = filtered.length;
    const skip       = (page - 1) * limit;
    const paginated  = filtered.slice(skip, skip + limit);

    return {
      totalLogs:    total,
      returnedLogs: paginated.length,
      filters: {
        action: action || null,
        entity: entity || null,
        search: search || null
      },
      logs: paginated
    };
  } catch (error) {
    throw error;
  }
};
