import React from 'react';
import Table from '../../common/Table';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDate, truncate } from '../../../utils/formatters';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderTable({ orders, loading, onEdit, onDelete, selectedRows, onSelectRow, onSelectAll }) {
  const navigate = useNavigate();

  const allSelected = orders?.length > 0 && selectedRows?.size === orders.length;
  
  const columns = [
    {
      key: 'checkbox',
      label: (
        <input 
          type="checkbox" 
          checked={allSelected} 
          onChange={(e) => onSelectAll(e.target.checked)}
          className="rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30"
        />
      ),
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={selectedRows?.has(row.OrderID || row._id)}
          onChange={(e) => onSelectRow(row.OrderID || row._id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30"
        />
      )
    },
    { key: 'OrderID', label: 'Order ID', render: (val) => <span className="font-order-id text-red-400 hover:text-red-300">#{val}</span> },
    { key: 'CustomerName', label: 'Customer', render: (val) => <span className="font-body text-[13px]">{val}</span> },
    { key: 'ProductName', label: 'Product', render: (val) => <span className="font-body text-[13px]" title={val}>{truncate(val, 20)}</span> },
    { key: 'TotalAmount', label: 'Amount', render: (val) => <span className="font-currency text-[13px] text-white tabular-nums">{formatCurrency(val)}</span> },
    { key: 'OrderStatus', label: 'Status', render: (val) => <OrderStatusBadge status={val} /> },
    { key: 'OrderDate', label: 'Date', render: (val) => <span className="font-timestamp text-red-200/60">{formatDate(val)}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => navigate(`/orders/${row.OrderID || row._id}`)}
            className="p-1.5 text-red-400 hover:text-white hover:bg-red-900/40 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {onEdit && (
            <button 
              onClick={() => onEdit(row)}
              className="p-1.5 text-red-400 hover:text-white hover:bg-red-900/40 rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(row)}
              className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-900/40 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <Table 
      columns={columns} 
      data={orders} 
      loading={loading} 
      onRowClick={(row) => navigate(`/orders/${row.OrderID || row._id}`)}
      emptyMessage="No orders found matching your criteria."
    />
  );
}
