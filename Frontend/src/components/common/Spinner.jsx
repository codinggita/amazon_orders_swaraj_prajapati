import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Spinner({ size = 'md', className, center = false, overlay = false, fullScreen = false }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const loader = (
    <div className={cn("relative flex justify-center items-center", sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-[spin_1s_linear_infinite]" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-brand-400 opacity-60 animate-[spin_1.5s_ease-in-out_infinite]" />
      <Loader2 className="w-1/2 h-1/2 animate-spin text-brand-600 relative z-10" style={{ animationDuration: '2s' }} />
    </div>
  );

  if (overlay || fullScreen) {
    return (
      <div 
        className={cn(
          "flex justify-center items-center z-50 animate-fade-in backdrop-blur-md bg-[#0a0a0a]/50 transition-all duration-300",
          fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-xl"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          {loader}
        </div>
      </div>
    );
  }

  if (center) {
    return <div className="flex justify-center items-center p-8 w-full h-full">{loader}</div>;
  }

  return loader;
}
