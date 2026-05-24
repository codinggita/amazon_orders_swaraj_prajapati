import React from 'react';
import { cn } from '../../utils/helpers';
import Spinner from './Spinner';

/**
 * Wraps loaded content with a glass fade-in; shows glass shimmer while loading.
 */
export default function GlassContent({
  loading,
  children,
  className,
  minHeight = '120px',
  empty = false,
  emptyMessage = 'No data found',
}) {
  if (loading) {
    return (
      <div
        className={cn('glass-shimmer rounded-xl border border-[#2d1515]/80 relative overflow-hidden', className)}
        style={{ minHeight }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Spinner />
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div
        className={cn(
          'glass-panel rounded-xl flex items-center justify-center text-red-300/50 font-body-sm',
          className
        )}
        style={{ minHeight }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('glass-reveal-in', className)} style={{ minHeight: minHeight === 'auto' ? undefined : minHeight }}>
      {children}
    </div>
  );
}
