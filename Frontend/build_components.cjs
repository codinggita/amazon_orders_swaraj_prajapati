const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const commonDir = path.join(componentsDir, 'common');
const layoutDir = path.join(componentsDir, 'layout');

[componentsDir, commonDir, layoutDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  'common/Button.jsx': `import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Button = React.forwardRef(({ variant = 'primary', size = 'md', loading, disabled, icon: Icon, children, className, ...rest }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-brand-900/60 border border-brand-800 text-brand-300 hover:bg-brand-900/80',
    danger: 'bg-red-700 text-white hover:bg-red-800',
    ghost: 'hover:bg-red-950/40 text-red-300',
    outline: 'border border-red-700 text-red-400 hover:bg-red-950/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
`,
  'common/Input.jsx': `import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Input = React.forwardRef(({ label, error, icon: Icon, rightIcon: RightIcon, type = 'text', className, ...rest }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-red-400/70 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400/50" />}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-[#0d0d0d] border rounded-lg h-11 text-white transition-all duration-200 focus:outline-none focus:ring-1',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-[#2d1515] focus:border-red-600 focus:ring-red-600/30',
            Icon ? 'pl-11' : 'px-4',
            RightIcon ? 'pr-11' : 'pr-4',
            'placeholder:text-red-300/30',
            className
          )}
          {...rest}
        />
        {RightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400/50 hover:text-red-300 cursor-pointer">{RightIcon}</div>}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
`,
  'common/Badge.jsx': `import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export default function Badge({ children, variant = 'status', color, className, dot, count }) {
  if (variant === 'count') {
    return (
      <span className={cn('bg-brand-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-bold', className)}>
        {count ?? children}
      </span>
    );
  }

  const statusClass = STATUS_COLORS[children] || 'bg-gray-900/40 text-gray-400 border border-gray-800';

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', color || statusClass, className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />}
      {children}
    </span>
  );
}
`,
  'common/Card.jsx': `import React from 'react';
import { cn } from '../../utils/helpers';

export default function Card({ title, subtitle, actions, children, className, hover, padding = 'p-5' }) {
  return (
    <div className={cn(
      'bg-[#111]/60 border border-[#2d1515] rounded-xl transition-all duration-200',
      hover && 'hover:border-red-700/40 hover:shadow-lg hover:shadow-red-950/20',
      className
    )}>
      {title && (
        <div className="flex items-center justify-between p-5 border-b border-[#2d1515]/50 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-red-300/50 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
}
`,
  'common/Modal.jsx': `import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Modal({ show, onClose, title, size = 'md', children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/60 flex items-center justify-center p-4 transition-opacity"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={cn('bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/50 rounded-2xl shadow-2xl shadow-red-950/50 w-full animate-scale-in flex flex-col', sizes[size])}>
        <div className="flex items-center justify-between p-5 border-b border-red-900/30">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg hover:bg-red-950/50 p-1.5 text-red-400 hover:text-red-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
`,
  'common/Table.jsx': `import React from 'react';
import { cn } from '../../utils/helpers';
import EmptyState from './EmptyState';
import Skeleton from './Skeleton';
import { FolderSearch } from 'lucide-react';

export default function Table({ columns, data, loading, emptyMessage = "No data found", onRowClick }) {
  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-[#2d1515]">
        <div className="w-full bg-[#2d1515] h-11" />
        <div className="divide-y divide-[#2d1515]">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="px-4 py-4"><Skeleton type="text" /></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-xl border border-[#2d1515] bg-[#111]/40">
        <EmptyState icon={FolderSearch} title="No Records" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#2d1515]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#2d1515]">
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-red-300 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2d1515] bg-[#0d0d0d]/40">
          {data.map((row, rowIdx) => (
            <tr 
              key={row.id || row._id || rowIdx} 
              onClick={() => onRowClick && onRowClick(row)}
              className={cn('transition-colors duration-150', onRowClick ? 'cursor-pointer hover:bg-red-950/20' : 'hover:bg-red-950/10')}
            >
              {columns.map((col, colIdx) => (
                <td key={col.key || colIdx} className="px-4 py-3.5 text-sm text-red-100/80">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,
  'common/Pagination.jsx': `import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }) {
  if (totalPages <= 1 && total === 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) end = Math.min(5, totalPages);
    if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-red-300/70">
      <div className="flex items-center gap-3">
        <span>Showing <span className="font-medium text-red-200">{startItem}-{endItem}</span> of <span className="font-medium text-red-200">{total}</span></span>
        {onLimitChange && (
          <select 
            value={limit} 
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-[#1c1112] border border-[#2d1515] rounded-md px-2 py-1 text-red-200 focus:outline-none focus:border-red-500"
          >
            {[10, 20, 50, 100].map(opt => (
              <option key={opt} value={opt}>{opt} / page</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => onPageChange(page - 1)} 
          disabled={page === 1}
          className="p-1.5 rounded-md border border-[#2d1515] bg-[#1c1112] text-red-300 hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {getPageNumbers().map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-8 h-8 rounded-md font-medium flex items-center justify-center transition-colors',
              p === page 
                ? 'bg-brand-600 text-white border-transparent' 
                : 'border border-[#2d1515] bg-[#1c1112] text-red-300 hover:bg-red-950/40'
            )}
          >
            {p}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(page + 1)} 
          disabled={page === totalPages}
          className="p-1.5 rounded-md border border-[#2d1515] bg-[#1c1112] text-red-300 hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
`,
  'common/Spinner.jsx': `import React from 'react';
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
`,
  'common/Skeleton.jsx': `import React from 'react';
import { cn } from '../../utils/helpers';

export default function Skeleton({ type = 'text', className }) {
  const types = {
    text: 'h-4 w-full rounded bg-red-950/30',
    card: 'h-32 w-full rounded-xl bg-red-950/20',
    avatar: 'w-10 h-10 rounded-full bg-red-950/30',
    chart: 'h-64 w-full rounded-xl bg-red-950/20'
  };

  return <div className={cn('animate-pulse', types[type] || types.text, className)} />;
}
`,
  'common/EmptyState.jsx': `import React from 'react';

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
`,
  'common/ErrorState.jsx': `import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-red-950/10 rounded-xl border border-red-900/20">
      <AlertTriangle className="w-12 h-12 text-red-500/60 mb-4" />
      <h3 className="text-lg font-semibold text-red-400">Something went wrong</h3>
      <p className="text-sm text-red-400/60 mt-2 max-w-md">{typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}
`,
  'common/ConfirmDialog.jsx': `import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ show, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading }) {
  return (
    <Modal show={show} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center pt-2 pb-6">
        <div className={\`w-16 h-16 rounded-full flex items-center justify-center mb-4 \${danger ? 'bg-red-950/50 text-red-500' : 'bg-amber-950/50 text-amber-500'}\`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-red-200/80 text-sm mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
`,
  'common/Tooltip.jsx': `import React, { useState } from 'react';
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
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(componentsDir, relPath), content);
}

console.log("Components created successfully.");
