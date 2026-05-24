import React from 'react';
import Badge from '../../common/Badge';

export default function OrderStatusBadge({ status }) {
  return <Badge variant="status" dot>{status}</Badge>;
}
