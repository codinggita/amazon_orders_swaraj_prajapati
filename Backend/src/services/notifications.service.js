// src/services/notifications.service.js

// ──────────────────────────────────────────────────────────────────────────────
// IN-MEMORY STORE – persists across requests in the same process
// ──────────────────────────────────────────────────────────────────────────────
const notificationsStore = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order ORD0000001 has been placed by Vihaan Sharma",
    isRead: false,
    priority: "high",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Confirmed",
    message: "Payment of ₹319.86 received for order ORD0000001",
    isRead: false,
    priority: "medium",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    type: "shipping",
    title: "Order Shipped",
    message: "Order ORD0000002 has been shipped via FedEx",
    isRead: true,
    priority: "medium",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday 2-4 AM IST",
    isRead: false,
    priority: "low",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    type: "alert",
    title: "Low Stock Alert",
    message: "Product Drone Mini (P00014) is running low on stock",
    isRead: true,
    priority: "high",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

let notifIdCounter = 6;

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/notifications
// ──────────────────────────────────────────────────────────────────────────────
exports.getNotifications = (query) => {
  try {
    const page  = parseInt(query.page,  10) || 1;
    const limit = parseInt(query.limit, 10) || 10;

    // Build filtered list (sorted newest-first)
    let filtered = [...notificationsStore].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Optional filters
    if (query.isRead !== undefined) {
      const isReadBool = query.isRead === "true";
      filtered = filtered.filter((n) => n.isRead === isReadBool);
    }
    if (query.type) {
      filtered = filtered.filter((n) => n.type === query.type);
    }
    if (query.priority) {
      filtered = filtered.filter((n) => n.priority === query.priority);
    }

    const total      = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const skip       = (page - 1) * limit;
    const paginated  = filtered.slice(skip, skip + limit);

    const unreadCount = notificationsStore.filter((n) => !n.isRead).length;

    return {
      unreadCount,
      notifications: paginated,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/notifications/read/:id
// ──────────────────────────────────────────────────────────────────────────────
exports.markAsRead = (id) => {
  try {
    const notif = notificationsStore.find((n) => n.id === id);
    if (!notif) return { status: "not_found" };
    if (notif.isRead) return { status: "already_read", data: notif };

    notif.isRead = true;
    notif.readAt = new Date().toISOString();

    return {
      status: "success",
      data: {
        id:     notif.id,
        title:  notif.title,
        isRead: notif.isRead,
        readAt: notif.readAt
      }
    };
  } catch (error) {
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/notifications/:id
// ──────────────────────────────────────────────────────────────────────────────
exports.deleteNotification = (id) => {
  try {
    const index = notificationsStore.findIndex((n) => n.id === id);
    if (index === -1) return null;

    notificationsStore.splice(index, 1);

    return {
      deletedId:      id,
      remainingCount: notificationsStore.length
    };
  } catch (error) {
    throw error;
  }
};
