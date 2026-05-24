import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import AreaChart from '../../components/charts/AreaChart';
import OrderStatusBadge from '../../components/features/orders/OrderStatusBadge';
import { formatCurrency, formatCurrencyCompact } from '../../utils/formatters';
import {
  IndianRupee, ShoppingCart, RotateCcw, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { analyticsAPI } from '../../api/analytics.api';
import { systemAPI } from '../../api/system.api';
import { ordersAPI } from '../../api/orders.api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [revTotal, ordCount, retRate, sysPing, revMonthly, ordRecent] = await Promise.all([
          analyticsAPI.revenueTotal().catch(() => ({ data: { data: {} } })),
          analyticsAPI.ordersCount().catch(() => ({ data: { data: {} } })),
          analyticsAPI.returnRate().catch(() => ({ data: { data: { returnRate: 0 } } })),
          systemAPI.ping().catch(() => ({ data: { success: false } })),
          analyticsAPI.revenueMonthly().catch(() => ({ data: { data: [] } })),
          ordersAPI.getAll({ limit: 5, sort: '-date' }).catch(() => ({ data: { data: [] } }))
        ]);

        setData({
          revenue: revTotal.data?.data?.totalRevenue || 0,
          orders: revTotal.data?.data?.totalOrders || ordCount.data?.data?.count || 0,
          returnRate: retRate.data?.data?.returnRate || 0,
          systemStatus: sysPing.data?.success ? 'Operational' : 'Degraded',
          revenueChart: (revMonthly.data?.data || []).map(item => ({
            name: item.month,
            value: item.totalRevenue || 0
          })),
          recentOrders: ordRecent.data?.data || []
        });
      } catch {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner center />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  const revenueNum = parseFloat(data.revenue) || 0;
  const useCompactRevenue = revenueNum >= 1e7;

  const KPICard = ({ title, value, fullValue, icon: Icon, trend, trendLabel, iconBg, iconColor }) => (
    <div className="kpi-card h-full rounded-xl border border-[#4b2020]/80 bg-gradient-to-br from-[#1c1112] to-[#0f0a0a] p-5 shadow-lg shadow-black/30 hover:border-red-700/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <p className="kpi-label">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <p
        className="font-metric text-white tracking-[-0.025em] tabular-nums font-reveal animate-count-up break-all leading-tight"
        style={{ fontSize: useCompactRevenue && title === 'TOTAL REVENUE' ? 'clamp(1.25rem, 4vw, 1.75rem)' : 'clamp(1.5rem, 4vw, 2rem)' }}
        title={fullValue || value}
      >
        {value}
      </p>
      {trend !== undefined && trend !== null && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend > 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
          )}
          <span className={`font-percent text-[12px] tabular-nums ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{Math.abs(trend)}%
          </span>
          <span className="font-body-xs text-[11px] text-red-300/55 opacity-100">{trendLabel}</span>
        </div>
      )}
      {trend === undefined && trendLabel && (
        <div className="flex items-center gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live shrink-0" />
          <span className="font-body-sm text-[12px] text-emerald-400 font-medium opacity-100">{trendLabel}</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        label="OPERATIONAL DASHBOARD"
        title="Overview"
        subtitle="Real-time metrics for Amazon Seller Central"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="TOTAL REVENUE"
          value={useCompactRevenue ? formatCurrencyCompact(data.revenue) : formatCurrency(data.revenue)}
          fullValue={formatCurrency(data.revenue)}
          icon={IndianRupee}
          trend={12.5}
          trendLabel="vs last month"
          iconBg="bg-red-600/15"
          iconColor="text-red-400"
        />
        <KPICard
          title="TOTAL ORDERS"
          value={data.orders.toLocaleString('en-IN')}
          icon={ShoppingCart}
          trend={5.2}
          trendLabel="vs last month"
          iconBg="bg-red-600/15"
          iconColor="text-red-400"
        />
        <KPICard
          title="RETURN RATE"
          value={`${data.returnRate.toFixed(1)}%`}
          icon={RotateCcw}
          trend={-1.1}
          trendLabel="vs last month"
          iconBg="bg-orange-500/15"
          iconColor="text-orange-400"
        />
        <KPICard
          title="SYSTEM HEALTH"
          value="99.9%"
          icon={Activity}
          trendLabel={data.systemStatus}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Revenue Velocity" padding="p-5 pb-0" className="glass-panel border-[#4b2020]/50">
            <AreaChart
              data={data.revenueChart.length ? data.revenueChart : [{ name: 'Jan', value: 0 }]}
              dataKey="value"
              xKey="name"
            />
          </Card>
        </div>
        <div>
          <Card padding="p-0" className="glass-panel border-[#4b2020]/50 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[#2d1515]">
              <h3 className="font-card-title text-[15px] text-white">Action Required</h3>
              <Link to="/orders" className="font-body-xs text-[11px] text-red-400 hover:text-red-300">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[#2d1515]">
              {data.recentOrders.slice(0, 5).map((order, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-red-950/10 transition-colors">
                  <div>
                    <p className="font-order-id text-[12px] text-red-400">
                      #{order.OrderID || order._id}
                    </p>
                    <p className="font-currency text-[13px] text-white tabular-nums mt-0.5">
                      {formatCurrency(order.TotalAmount)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.OrderStatus || 'Pending'} />
                </div>
              ))}
              {data.recentOrders.length === 0 && (
                <div className="p-8 text-center font-body-sm text-red-300/50">No recent orders</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
