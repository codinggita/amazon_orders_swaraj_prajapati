import React from 'react';
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
              <th key={col.key || idx} className="font-table-header text-red-400/50 px-4 py-3 text-left whitespace-nowrap">
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
