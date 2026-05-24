import React from 'react';
import { cn } from '../../utils/helpers';

export default function Skeleton({ type = 'text', className }) {
  const types = {
    text: 'h-4 w-full rounded bg-red-950/30',
    card: 'h-32 w-full rounded-xl bg-red-950/20',
    avatar: 'w-10 h-10 rounded-full bg-red-950/30',
    chart: 'h-64 w-full rounded-xl bg-red-950/20'
  };

  return <div className={cn('animate-pulse', types[type] || types.text, className)} />;
}
