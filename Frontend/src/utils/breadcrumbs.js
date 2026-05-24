/** Longest-prefix route match for navbar breadcrumbs */
export const ROUTE_META = [
  { prefix: '/dashboard', section: null, title: 'Overview', sectionPath: null },
  { prefix: '/profile', section: 'Account', title: 'Profile', sectionPath: '/profile' },
  { prefix: '/orders/', section: 'Orders', title: 'Order Details', sectionPath: '/orders' },
  { prefix: '/orders', section: 'Orders', title: 'All Orders', sectionPath: '/orders' },
  { prefix: '/bulk', section: 'Orders', title: 'Bulk Operations', sectionPath: '/orders' },
  { prefix: '/search', section: 'Orders', title: 'Search', sectionPath: '/orders' },
  { prefix: '/analytics', section: 'Analytics', title: 'Analytics', sectionPath: '/analytics' },
  { prefix: '/stats', section: 'Analytics', title: 'Statistics', sectionPath: '/analytics' },
  { prefix: '/customers', section: 'Customers', title: 'Customers', sectionPath: '/customers' },
  { prefix: '/recommendations', section: 'Customers', title: 'Recommendations', sectionPath: '/customers' },
  { prefix: '/trending', section: 'Products', title: 'Trending', sectionPath: '/trending' },
  { prefix: '/shipping', section: 'Shipping', title: 'Shipments', sectionPath: '/shipping' },
  { prefix: '/notifications', section: 'System', title: 'Notifications', sectionPath: '/notifications' },
  { prefix: '/admin', section: 'System', title: 'Admin Panel', sectionPath: '/admin' },
  { prefix: '/system', section: 'System', title: 'System Health', sectionPath: '/system' },
];

export function getRouteMeta(pathname) {
  const match = ROUTE_META.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  return match ?? { section: null, title: 'Dashboard', sectionPath: null };
}
