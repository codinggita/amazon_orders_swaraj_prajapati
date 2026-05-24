import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function AppLogo({
  size = 'md',
  showText = true,
  showTagline = false,
  collapsed = false,
  className,
}) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: { box: 'w-9 h-9', icon: 'w-4 h-4', title: 'text-[15px]', tag: 'text-[7px]' },
    md: { box: 'w-11 h-11', icon: 'w-5 h-5', title: 'text-[18px]', tag: 'text-[8px]' },
    lg: { box: 'w-20 h-20', icon: 'w-10 h-10', title: 'text-4xl', tag: 'text-[10px]' },
    xl: { box: 'w-24 h-24', icon: 'w-12 h-12', title: 'text-5xl', tag: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          s.box,
          'rounded-xl flex items-center justify-center shrink-0 overflow-hidden',
          'bg-[#1c1112] border border-red-800/50',
          'shadow-lg shadow-red-900/40 ring-1 ring-red-600/20'
        )}
      >
        {!imgError ? (
          <img
            src="/logo.svg"
            alt="OrderPulse"
            className="w-full h-full object-contain p-1.5"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
            <Activity className={cn(s.icon, 'text-white')} />
          </div>
        )}
      </div>

      {showText && !collapsed && (
        <div className="flex flex-col leading-none min-w-0">
          <span className={cn('font-logo themed-text tracking-logo', s.title)}>
            Order<span className="text-gradient-brand">Pulse</span>
          </span>
          {showTagline && (
            <span
              className={cn(
                'font-nav-label themed-muted tracking-ultra mt-1.5 block',
                s.tag
              )}
            >
              Smart Order Management
            </span>
          )}
        </div>
      )}
    </div>
  );
}
