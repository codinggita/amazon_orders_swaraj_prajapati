import React from 'react';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../../../utils/constants';
import Button from '../../common/Button';
import { Filter, X } from 'lucide-react';

export default function OrderFilters({ filters, onFilterChange, onClear }) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-[#111]/40 border border-[#2d1515] rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2d1515]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          {activeCount > 0 && (
            <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">{activeCount} active</span>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-red-400">
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-xs font-medium text-red-300/60 mb-2 uppercase tracking-wider">Status</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange('status', '')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!filters.status ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}`}
            >
              All
            </button>
            {ORDER_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => onFilterChange('status', status)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filters.status === status ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-red-300/60 mb-2 uppercase tracking-wider">Payment Method</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange('payment', '')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!filters.payment ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}`}
            >
              All
            </button>
            {PAYMENT_METHODS.map(method => (
              <button
                key={method}
                onClick={() => onFilterChange('payment', method)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filters.payment === method ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
