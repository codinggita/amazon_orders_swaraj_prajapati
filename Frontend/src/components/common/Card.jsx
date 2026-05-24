import React from 'react';
import { cn } from '../../utils/helpers';

export default function Card({ title, subtitle, actions, children, className, hover, padding = 'p-5', titleClassName }) {
  return (
    <div className={cn(
      'themed-card rounded-xl transition-all duration-200',
      hover && 'hover:border-red-700/40 hover:shadow-lg hover:shadow-red-950/20',
      className
    )}>
      {title && (
        <div className="flex items-center justify-between p-5 border-b themed-border pb-4">
          <div>
            <h3 className={cn('font-card-title text-[15px] themed-text', titleClassName)}>{title}</h3>
            {subtitle && <p className="font-body-xs mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
}
