import React from 'react';

export default function PageHeader({ label, title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
      <div>
        {label && (
          <p className="font-label text-[10px] tracking-[0.25em] text-red-500 mb-2">
            {label}
          </p>
        )}
        <h1 className="font-hero text-display-sm md:text-display-md text-white tracking-[-0.035em]">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-[13px] text-red-300/40 mt-2 tracking-[0.01em]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {actions}
        </div>
      )}
    </div>
  );
}
