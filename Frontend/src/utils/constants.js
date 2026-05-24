export const ORDER_STATUSES = [
  'Pending', 'Shipped', 'Out for Delivery',
  'Delivered', 'Cancelled', 'Refunded', 'Returned'
];

export const PAYMENT_METHODS = [
  'UPI', 'Debit Card', 'Credit Card',
  'Net Banking', 'COD', 'Wallet'
];

export const STATUS_COLORS = {
  Delivered:         'bg-green-900/40 text-green-400 border border-green-800',
  Shipped:           'bg-blue-900/40 text-blue-400 border border-blue-800',
  Pending:           'bg-amber-900/40 text-amber-400 border border-amber-800',
  Cancelled:         'bg-red-900/40 text-red-400 border border-red-800',
  Refunded:          'bg-purple-900/40 text-purple-400 border border-purple-800',
  Returned:          'bg-orange-900/40 text-orange-400 border border-orange-800',
  'Out for Delivery': 'bg-cyan-900/40 text-cyan-400 border border-cyan-800',
};

export const SORT_OPTIONS = [
  { label: 'Newest First', value: '-date' },
  { label: 'Oldest First', value: 'date' },
  { label: 'Highest Amount', value: '-amount' },
  { label: 'Lowest Amount', value: 'amount' },
  { label: 'Status', value: 'status' },
  { label: 'Customer', value: 'customer' },
];

export const APP_NAME = 'OrderPulse';
export const APP_TAGLINE = 'The Heartbeat of Your Business';
