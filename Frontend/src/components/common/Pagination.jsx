import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helpers';
import Select from './Select';

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
          <div className="w-32">
            <Select 
              value={limit} 
              onChange={(e) => onLimitChange(Number(e.target.value))}
              options={[
                { value: 10, label: '10 / page' },
                { value: 20, label: '20 / page' },
                { value: 50, label: '50 / page' },
                { value: 100, label: '100 / page' }
              ]}
              className="h-8"
            />
          </div>
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
