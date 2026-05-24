import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export default function Badge({ children, variant = 'status', color, className, dot, count }) {
  if (variant === 'count') {
    return (
      <span className={cn('font-badge bg-brand-600 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 tabular-nums', className)}>
        {count ?? children}
      </span>
    );
  }

  const statusClass = STATUS_COLORS[children] || 'bg-gray-900/40 text-gray-400 border border-gray-800';

  return (
    <span className={cn('font-badge inline-flex items-center px-2.5 py-0.5 rounded-md border', color || statusClass, className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />}
      {children}
    </span>
  );
}
