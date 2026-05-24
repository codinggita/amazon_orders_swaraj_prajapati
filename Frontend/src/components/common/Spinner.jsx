import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Spinner({ size = 'md', className, center = false }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const loader = <Loader2 className={cn('animate-spin text-brand-600', sizes[size], className)} />;

  if (center) {
    return <div className="flex justify-center items-center p-8 w-full h-full">{loader}</div>;
  }

  return loader;
}
