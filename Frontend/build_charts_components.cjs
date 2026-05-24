const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

const files = {
  'charts/AreaChart.jsx': `import React from 'react';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AreaChart({ data, dataKey, xKey = 'name', title, color = '#dc2626', height = 300 }) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={\`color-\${dataKey}\`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1515" vertical={false} />
            <XAxis dataKey={xKey} stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={{ stroke: '#2d1515' }} tickLine={false} />
            <YAxis stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={\`url(#color-\${dataKey})\`} />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
`,
  'charts/BarChart.jsx': `import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export default function BarChart({ data, dataKey, xKey = 'name', title, color = '#dc2626', height = 300 }) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1515" vertical={false} />
            <XAxis dataKey={xKey} stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={{ stroke: '#2d1515' }} tickLine={false} />
            <YAxis stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#2d1515', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={entry.color || color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
`,
  'charts/LineChart.jsx': `import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function LineChart({ data, dataKey, xKey = 'name', title, color = '#dc2626', height = 300 }) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1515" vertical={false} />
            <XAxis dataKey={xKey} stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={{ stroke: '#2d1515' }} tickLine={false} />
            <YAxis stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ fill: color, stroke: '#0a0a0a', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
`,
  'charts/PieChart.jsx': `import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function PieChart({ data, colors, title, height = 300 }) {
  const defaultColors = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#0891b2', '#2563eb', '#4f46e5', '#9333ea'];
  const pieColors = colors || defaultColors;

  return (
    <div className="w-full flex flex-col items-center">
      {title && <h4 className="text-sm font-semibold text-white mb-2 self-start">{title}</h4>}
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              stroke="#0a0a0a"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#dc262680' }} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
`,
  'charts/DonutChart.jsx': `import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function DonutChart({ data, colors, title, height = 300, centerText, centerSubtext }) {
  const defaultColors = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#0891b2', '#2563eb', '#4f46e5', '#9333ea'];
  const pieColors = colors || defaultColors;

  return (
    <div className="w-full flex flex-col items-center relative">
      {title && <h4 className="text-sm font-semibold text-white mb-2 self-start">{title}</h4>}
      
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
          <span className="text-2xl font-bold text-white">{centerText}</span>
          {centerSubtext && <span className="text-xs text-red-300/60">{centerSubtext}</span>}
        </div>
      )}

      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              stroke="#0a0a0a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#dc262680' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
`,
  'features/orders/OrderStatusBadge.jsx': `import React from 'react';
import Badge from '../../common/Badge';

export default function OrderStatusBadge({ status }) {
  return <Badge variant="status" dot>{status}</Badge>;
}
`,
  'features/orders/OrderFilters.jsx': `import React from 'react';
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
              className={\`px-3 py-1 rounded-full text-xs font-medium border transition-colors \${!filters.status ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}\`}
            >
              All
            </button>
            {ORDER_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => onFilterChange('status', status)}
                className={\`px-3 py-1 rounded-full text-xs font-medium border transition-colors \${filters.status === status ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}\`}
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
              className={\`px-3 py-1 rounded-full text-xs font-medium border transition-colors \${!filters.payment ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}\`}
            >
              All
            </button>
            {PAYMENT_METHODS.map(method => (
              <button
                key={method}
                onClick={() => onFilterChange('payment', method)}
                className={\`px-3 py-1 rounded-full text-xs font-medium border transition-colors \${filters.payment === method ? 'bg-brand-600 border-brand-500 text-white' : 'bg-[#1c1112] border-[#2d1515] text-red-300 hover:bg-red-950/40'}\`}
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
`,
  'features/orders/OrderTable.jsx': `import React from 'react';
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
          checked={selectedRows?.has(row._id || row.OrderID)}
          onChange={(e) => onSelectRow(row._id || row.OrderID, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30"
        />
      )
    },
    { key: 'OrderID', label: 'Order ID', render: (val) => <span className="font-mono text-brand-400">#{val}</span> },
    { key: 'CustomerName', label: 'Customer' },
    { key: 'ProductName', label: 'Product', render: (val) => <span title={val}>{truncate(val, 20)}</span> },
    { key: 'TotalAmount', label: 'Amount', render: (val) => <span className="font-medium text-white">{formatCurrency(val)}</span> },
    { key: 'OrderStatus', label: 'Status', render: (val) => <OrderStatusBadge status={val} /> },
    { key: 'OrderDate', label: 'Date', render: (val) => <span className="text-red-200/60">{formatDate(val)}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => navigate(\`/orders/\${row._id || row.OrderID}\`)}
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
      onRowClick={(row) => navigate(\`/orders/\${row._id || row.OrderID}\`)}
      emptyMessage="No orders found matching your criteria."
    />
  );
}
`,
  'features/notifications/NotificationDropdown.jsx': `import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../../api/notifications.api';
import { getTimeAgo } from '../../../utils/formatters';
import { ShoppingBag, CreditCard, Truck, Settings, AlertTriangle, CheckCircle, X, Eye } from 'lucide-react';
import Spinner from '../../common/Spinner';

export default function NotificationDropdown({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getAll({ limit: 5 });
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-brand-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'shipping': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Settings className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/40 rounded-xl shadow-2xl z-50 animate-scale-in flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-[#2d1515]">
        <div>
          <h3 className="font-semibold text-white">Notifications</h3>
          <p className="text-xs text-red-300/60 mt-0.5">{notifications.filter(n => !n.isRead).length} unread</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 flex justify-center"><Spinner /></div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-red-300/50">No notifications</div>
        ) : (
          <div className="divide-y divide-[#2d1515]">
            {notifications.map(n => (
              <div key={n._id} className={\`p-4 hover:bg-red-950/20 transition-colors flex gap-3 relative group \${!n.isRead ? 'bg-red-950/10' : ''}\`}>
                {!n.isRead && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500" />}
                <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-[#2d1515] flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={\`text-sm text-white truncate \${!n.isRead ? 'font-semibold' : ''}\`}>{n.title}</p>
                  <p className="text-xs text-red-300/70 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-red-400/50 mt-1">{getTimeAgo(n.createdAt)}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                  {!n.isRead && (
                    <button onClick={(e) => handleMarkRead(n._id, e)} className="p-1 rounded hover:bg-[#2d1515] text-red-400" title="Mark as read">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-[#2d1515] text-center bg-[#111] rounded-b-xl">
        <button 
          onClick={() => { onClose(); navigate('/notifications'); }}
          className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(componentsDir, relPath), content);
}

console.log("Chart and Feature components created successfully.");
