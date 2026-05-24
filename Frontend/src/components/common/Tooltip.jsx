import React, { useState } from 'react';
import { cn } from '../../utils/helpers';

export default function Tooltip({ text, children, position = 'top', className }) {
  const [show, setShow] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <div className={cn(
          'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-red-100 bg-[#1c1112] border border-red-900/40 rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none',
          positions[position],
          className
        )}>
          {text}
        </div>
      )}
    </div>
  );
}
