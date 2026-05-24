import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-red-950/30 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-red-800/50" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-red-200/60">{title}</h3>
      {description && <p className="text-sm text-red-400/40 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
