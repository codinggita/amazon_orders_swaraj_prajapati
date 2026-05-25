import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import SEO from '../../components/common/SEO';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1112] border border-[#4b2020] rounded-lg p-3 text-sm shadow-xl">
      <p className="text-red-300 font-medium mb-1">{label}</p>
      <p className="text-white">Revenue: {formatCurrency(payload[0]?.value)}</p>
    </div>
  );
};

export default function StatsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersTotal, revenueTotal, ordersMonthly, revenueMonthly, productsCount, customersCount, refundsCount, cancellationsCount] = await Promise.all([
          api.get('/stats/orders/total').catch(() => ({ data: { data: {} } })),
          api.get('/stats/revenue/total').catch(() => ({ data: { data: {} } })),
          api.get('/stats/orders/monthly').catch(() => ({ data: { data: {} } })),
          api.get('/stats/revenue/monthly').catch(() => ({ data: { data: {} } })),
          api.get('/stats/products/count').catch(() => ({ data: { data: {} } })),
          api.get('/stats/customers/count').catch(() => ({ data: { data: {} } })),
          api.get('/stats/refunds/count').catch(() => ({ data: { data: {} } })),
          api.get('/stats/cancellations/count').catch(() => ({ data: { data: {} } }))
        ]);

        setData({
          ordersTotal: ordersTotal.data?.data || {},
          revenueTotal: revenueTotal.data?.data || {},
          ordersMonthly: ordersMonthly.data?.data || {},
          revenueMonthly: revenueMonthly.data?.data || {},
          productsCount: productsCount.data?.data || {},
          customersCount: customersCount.data?.data || {},
          refundsCount: refundsCount.data?.data || {},
          cancellationsCount: cancellationsCount.data?.data || {}
        });
      } catch (err) {
        setError('Failed to load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner center />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  const {
    ordersTotal, revenueTotal, ordersMonthly, revenueMonthly,
    productsCount, customersCount, refundsCount, cancellationsCount
  } = data;

  const statusColors = {
    Delivered: '#10b981',
    Shipped: '#3b82f6',
    Pending: '#f59e0b',
    Cancelled: '#ef4444',
    Refunded: '#a855f7',
    Returned: '#f97316',
    'Out for Delivery': '#06b6d4'
  };

  const statusData = Array.isArray(ordersTotal.statusBreakdown) 
    ? ordersTotal.statusBreakdown.map(item => ({ name: item.status, value: item.count }))
    : [];
  const monthlyRevData = revenueMonthly.monthly ? revenueMonthly.monthly.map(item => ({ name: item.month, revenue: item.revenue })) : [];

  return (
    <>
      <SEO
        title="Statistics"
        description="Detailed order and revenue statistics including daily, monthly, and yearly breakdowns with growth rates and fulfillment metrics."
        url="/stats"
        keywords="order statistics, revenue statistics, monthly orders, yearly analytics"
      />
      <div>
        <PageHeader
          label="STATISTICS"
          title="Statistics"
          subtitle="Comprehensive data analysis & insights"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-5 relative">
            <p className="text-xs text-red-300/60 uppercase tracking-wider mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-white">{formatNumber(ordersTotal.totalOrders)}</p>
          </div>
          <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-5 relative">
            <p className="text-xs text-red-300/60 uppercase tracking-wider mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(revenueTotal.totalRevenue)}</p>
          </div>
          <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-5 relative">
            <p className="text-xs text-red-300/60 uppercase tracking-wider mb-2">Unique Products</p>
            <p className="text-3xl font-bold text-white">{formatNumber(productsCount.totalUniqueProducts)}</p>
          </div>
          <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-5 relative">
            <p className="text-xs text-red-300/60 uppercase tracking-wider mb-2">Unique Customers</p>
            <p className="text-3xl font-bold text-white">{formatNumber(customersCount.totalUniqueCustomers)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Order Statistics">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-2">
                {/* Left: Donut Chart with Center Metric */}
                <div className="w-48 h-48 flex-shrink-0 relative flex items-center justify-center">
                  {statusData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={3}
                            stroke="var(--bg-surface)"
                            strokeWidth={2}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={statusColors[entry.name] || 'var(--brand-primary)'} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'var(--bg-surface)',
                              borderColor: 'var(--border-color)',
                              borderRadius: '8px',
                              color: 'var(--text-primary)',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '12px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Centered overall total inside the donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] uppercase tracking-widest text-red-400/50 font-semibold">Processed</span>
                        <span className="text-2xl font-display font-extrabold text-white leading-tight">
                          {formatNumber(ordersTotal.totalOrders)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-red-300/50">No data available</div>
                  )}
                </div>

                {/* Right: Detailed Custom Legend Grid */}
                <div className="flex-1 w-full">
                  <div className="mb-4 pb-3 border-b border-[#2d1515]">
                    <p className="text-xs text-red-400/50 uppercase tracking-widest mb-0.5">Status Distribution</p>
                    <p className="text-[11px] text-red-300/60">Breakdown of all order actions</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {statusData.map((item) => {
                      const color = statusColors[item.name] || 'var(--brand-primary)';
                      const count = item.value;
                      const total = ordersTotal.totalOrders || 1;
                      const pct = ((count / total) * 100).toFixed(1);
                      
                      return (
                        <div 
                          key={item.name} 
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-950/5 border border-red-950/20 hover:border-red-900/40 hover:bg-red-950/10 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ 
                                backgroundColor: color, 
                                boxShadow: `0 0 6px ${color}bf` 
                              }} 
                            />
                            <span className="font-body text-[12px] text-red-200/90 font-medium">{item.name}</span>
                          </div>
                          <div className="text-right flex items-center gap-1.5">
                            <span className="font-metric text-xs text-white font-semibold">{formatNumber(count)}</span>
                            <span className="font-badge text-[9px] text-red-400/40 font-normal">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Revenue Breakdown">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-red-300/60 uppercase mb-1">Total Revenue</p>
                  <p className="font-semibold text-white">{formatCurrency(revenueTotal.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-red-300/60 uppercase mb-1">Total Tax</p>
                  <p className="font-semibold text-white">{formatCurrency(revenueTotal.totalTax)}</p>
                </div>
                <div>
                  <p className="text-xs text-red-300/60 uppercase mb-1">Total Discount</p>
                  <p className="font-semibold text-brand-400">-{formatCurrency(revenueTotal.totalDiscount)}</p>
                </div>
                <div>
                  <p className="text-xs text-red-300/60 uppercase mb-1">Net Revenue</p>
                  <p className="font-semibold text-green-400">{formatCurrency(revenueTotal.netRevenue)}</p>
                </div>
              </div>
              <div className="h-64">
                {monthlyRevData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevData}>
                      <defs>
                        <linearGradient id="redGradientStats" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d1515" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#fca5a5', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#fca5a5', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => '₹' + (v/1000).toFixed(0) + 'K'} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} fill="url(#redGradientStats)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-red-300/50">No data available</div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card title="Rates & Metrics">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-red-200">Cancellation Rate</span>
                    <span className="text-sm font-bold text-red-400">{cancellationsCount.cancellationRate || 0}%</span>
                  </div>
                  <div className="w-full bg-[#2d1515] rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: `${cancellationsCount.cancellationRate || 0}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-red-200">Refund Rate</span>
                    <span className="text-sm font-bold text-purple-400">{refundsCount.refundRate || 0}%</span>
                  </div>
                  <div className="w-full bg-[#2d1515] rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${refundsCount.refundRate || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card title="Monthly Breakdown" padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#2d1515]">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-red-300/70">Month</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-red-300/70">Orders</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-red-300/70">Revenue</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-red-300/70">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d1515]">
                {revenueMonthly.monthly?.length > 0 ? (
                  revenueMonthly.monthly.map((row, i) => {
                    const orderRow = ordersMonthly.monthly?.find(o => o.month === row.month) || { count: 0 };
                    const isPositive = parseFloat(row.growth) > 0;
                    const isNegative = parseFloat(row.growth) < 0;
                    return (
                      <tr key={i} className="hover:bg-red-950/10 transition-colors">
                        <td className="px-4 py-3 text-sm text-white">{row.month}</td>
                        <td className="px-4 py-3 text-sm text-white">{formatNumber(orderRow.count)}</td>
                        <td className="px-4 py-3 text-sm text-white">{formatCurrency(row.revenue)}</td>
                        <td className={`px-4 py-3 text-sm ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-red-300'}`}>
                          {isPositive && '↑ '}
                          {isNegative && '↓ '}
                          {row.growth ? `${row.growth}%` : '-'}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-red-300/50">No monthly data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
