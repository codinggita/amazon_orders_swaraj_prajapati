/** Extract payload from standard API envelope { success, data, ... } */
export function getPayload(res) {
  const body = res?.data ?? res ?? {};
  if (body.data !== undefined && body.data !== null) return body.data;
  return body;
}

export function parseRevenueTotal(res) {
  const p = getPayload(res);
  if (typeof p === 'number') return p;
  return p?.totalRevenue ?? p?.revenue ?? 0;
}

export function parseOrderCount(res) {
  const p = getPayload(res);
  if (typeof p === 'number') return p;
  return p?.total ?? p?.count ?? p?.totalOrders ?? 0;
}

export function parseReturnRate(res) {
  const p = getPayload(res);
  if (typeof p === 'number') return p;
  return p?.returnRate ?? p?.rate ?? 0;
}

/** Chart rows: { name, value } */
export function parseMonthlyRevenueChart(res) {
  const rows = getPayload(res);
  const list = Array.isArray(rows) ? rows : [];
  return list.map((item) => ({
    name: item.month ?? item._id ?? item.label ?? '—',
    value: Number(item.totalRevenue ?? item.revenue ?? item.total ?? item.value ?? 0),
  }));
}

export function parseCategoryChart(res) {
  const rows = getPayload(res);
  const list = Array.isArray(rows) ? rows : [];
  return list.map((item) => ({
    name: item.category ?? item._id ?? item.name ?? 'Other',
    value: Number(item.orderCount ?? item.count ?? item.totalRevenue ?? item.value ?? 0),
  }));
}

export function parsePaymentChart(res) {
  const rows = getPayload(res);
  const list = Array.isArray(rows) ? rows : [];
  return list.map((item) => ({
    name: item.paymentMethod ?? item._id ?? item.method ?? 'Unknown',
    value: Number(item.orderCount ?? item.count ?? item.value ?? 0),
  }));
}

export function parseOrdersList(res) {
  const body = res?.data ?? {};
  const list = body.data ?? body.orders ?? [];
  const total = body.total ?? (Array.isArray(list) ? list.length : 0);
  return {
    orders: Array.isArray(list) ? list : [],
    total: typeof total === 'number' ? total : 0,
    page: body.page,
    totalPages: body.totalPages,
  };
}

export function parseNotifications(res) {
  const p = getPayload(res);
  if (Array.isArray(p)) {
    return { notifications: p, unreadCount: p.filter((n) => !n.isRead).length };
  }
  const notifications = p?.notifications ?? p?.data ?? [];
  return {
    notifications: Array.isArray(notifications) ? notifications : [],
    unreadCount: p?.unreadCount ?? notifications.filter((n) => !n.isRead).length,
  };
}
