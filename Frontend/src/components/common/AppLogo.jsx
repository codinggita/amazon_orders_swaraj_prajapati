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
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', title: 'text-[15px]', tag: 'text-[7px]' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', title: 'text-[18px]', tag: 'text-[8px]' },
    lg: { box: 'w-16 h-16', icon: 'w-8 h-8', title: 'text-2xl', tag: 'text-[10px]' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          s.box,
          'rounded-xl flex items-center justify-center shrink-0',
          'bg-gradient-to-br from-red-600/20 to-red-950/40',
          'border border-red-800/40 shadow-lg shadow-red-900/30'
        )}
      >
        {!imgError ? (
          <img
            src="/logo.svg"
            alt="OrderPulse"
            className="w-[70%] h-[70%] object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <Activity className={cn(s.icon, 'text-white')} />
          </div>
        )}
      </div>

      {showText && !collapsed && (
        <div className="flex flex-col leading-none min-w-0">
          <span className={cn('font-logo text-white tracking-[-0.04em]', s.title)}>
            Order<span className="text-gradient-brand">Pulse</span>
          </span>
          {showTagline && (
            <span
              className={cn(
                'font-label text-red-600/50 tracking-[0.2em] mt-1 block uppercase',
                s.tag
              )}
            >
              The Heartbeat of Your Business
            </span>
          )}
        </div>
      )}
    </div>
  );
}
