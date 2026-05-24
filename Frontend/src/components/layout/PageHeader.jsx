import React from 'react';

export default function PageHeader({ label, title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 animate-fade-in">
      <div>
        {label && (
          <p className="font-label text-red-500 tracking-extreme text-[10px] mb-2">
            {label}
          </p>
        )}
        <h1 className="font-hero text-4xl md:text-5xl themed-text tracking-display leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-[13px] themed-muted mt-2">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
