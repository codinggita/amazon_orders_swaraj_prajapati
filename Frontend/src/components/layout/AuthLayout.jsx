import React from 'react';
import { cn } from '../../utils/helpers';

export default function AuthLayout({ children, wide = false }) {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(127, 29, 29, 0.4) 0%, transparent 55%), #0a0a0a',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(75, 32, 32, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(75, 32, 32, 0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className={cn('relative z-10 w-full', wide ? 'max-w-5xl' : 'max-w-md')}>
        {children}
      </div>
    </div>
  );
}
