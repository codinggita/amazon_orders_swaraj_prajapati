import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import GlassContent from '../../components/common/GlassContent';
import ErrorState from '../../components/common/ErrorState';
import AreaChart from '../../components/charts/AreaChart';
import OrderStatusBadge from '../../components/features/orders/OrderStatusBadge';
import { formatCurrency, formatCurrencyCompact, formatNumber } from '../../utils/formatters';
import {
  parseRevenueTotal,
  parseOrderCount,
  parseReturnRate,
  parseMonthlyRevenueChart,
  parseOrdersList,
} from '../../utils/apiHelpers';
import { DollarSign, ShoppingCart, RotateCcw, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { analyticsAPI } from '../../api/analytics.api';
import { systemAPI } from '../../api/system.api';
import { ordersAPI } from '../../api/orders.api';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [revTotal, ordCount, retRate, sysPing, revMonthly, ordRecent] = await Promise.all([
        analyticsAPI.revenueTotal(),
        analyticsAPI.ordersCount(),
        analyticsAPI.returnRate(),
        systemAPI.ping().catch(() => ({ data: { success: false } })),
        analyticsAPI.revenueMonthly(),
        ordersAPI.getAll({ limit: 5, sort: '-OrderDate' }),
      ]);

      const { orders: recentOrders } = parseOrdersList(ordRecent);
      const revenueChart = parseMonthlyRevenueChart(revMonthly);

      setData({
        revenue: parseRevenueTotal(revTotal),
        orders: parseOrderCount(ordCount),
        returnRate: parseReturnRate(retRate),
        systemStatus: sysPing.data?.success !== false ? 'Operational' : 'Degraded',
        revenueChart: revenueChart.length ? revenueChart : [],
        recentOrders,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (error && !data) {
    return <ErrorState error={error} onRetry={fetchDashboard} />;
  }

  const KPICard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => (
    <Card hover className="h-full kpi-card themed-card">
      <div className="flex justify-between items-start mb-4">
        <p className="kpi-label text-[9px] tracking-[0.18em] themed-muted">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="font-metric text-[32px] themed-text tabular-nums font-reveal">{value}</p>
      {trend != null && (
        <div className="flex items-center gap-1 mt-2">
          {trend > 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`font-percent text-[12px] ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
          <span className="font-body-xs text-[11px] ml-1 themed-muted">{trendLabel}</span>
        </div>
      )}
      {!trend && trendLabel && (
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-live" />
          <span className="font-body-sm text-green-400">{trendLabel}</span>
        </div>
      )}
    </Card>
  );

  const chartData = data?.revenueChart?.length
    ? data.revenueChart
    : [{ name: 'No data', value: 0 }];

  return (
    <div>
      <PageHeader
        label="OPERATIONAL DASHBOARD"
        title="Overview"
        subtitle="Real-time metrics for Amazon Seller Central"
      />

      <GlassContent loading={loading} minHeight="140px" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard
            title="Total Revenue"
            value={formatCurrencyCompact(data?.revenue ?? 0)}
            icon={DollarSign}
            trend={data?.revenue > 0 ? 12.5 : null}
            trendLabel="vs last month"
            colorClass="bg-green-500/20 text-green-500"
          />
          <KPICard
            title="Total Orders"
            value={formatNumber(data?.orders ?? 0)}
            icon={ShoppingCart}
            trend={data?.orders > 0 ? 5.2 : null}
            trendLabel="vs last month"
            colorClass="bg-brand-600/20 text-brand-500"
          />
          <KPICard
            title="Return Rate"
            value={`${(data?.returnRate ?? 0).toFixed(1)}%`}
            icon={RotateCcw}
            trend={data?.returnRate > 0 ? -1.1 : null}
            trendLabel="vs last month"
            colorClass="bg-orange-500/20 text-orange-500"
          />
          <KPICard
            title="System Health"
            value="99.9%"
            icon={Activity}
            trendLabel={data?.systemStatus ?? 'Operational'}
            colorClass="bg-blue-500/20 text-blue-500"
          />
        </div>
      </GlassContent>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassContent loading={loading} minHeight="320px">
            <Card title="Revenue Velocity" titleClassName="font-card-title text-[15px]" padding="p-5 pb-0">
              <AreaChart data={chartData} dataKey="value" xKey="name" height={280} />
            </Card>
          </GlassContent>
        </div>
        <div>
          <GlassContent
            loading={loading}
            minHeight="320px"
            empty={!loading && (!data?.recentOrders?.length)}
            emptyMessage="No recent orders"
          >
            <Card title="Action Required" titleClassName="font-card-title text-[15px]" padding="p-0">
              <div className="flex justify-between items-center p-4 border-b themed-border">
                <span className="font-card-title text-[15px] themed-text">Recent Orders</span>
                <Link to="/orders" className="font-body-xs text-red-400 hover:text-red-300">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-[var(--border-color)]">
                {(data?.recentOrders ?? []).slice(0, 5).map((order, i) => (
                  <Link
                    key={order.OrderID || order._id || i}
                    to={`/orders/${order.OrderID || order._id}`}
                    className="p-4 flex items-center justify-between hover:bg-brand-500/10 transition-colors block"
                  >
                    <div>
                      <p className="font-order-id text-brand-500">#{order.OrderID || order._id}</p>
                      <p className="font-currency text-[13px] themed-text mt-0.5">
                        {formatCurrency(order.TotalAmount)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.OrderStatus || 'Pending'} />
                  </Link>
                ))}
              </div>
            </Card>
          </GlassContent>
        </div>
      </div>
    </div>
  );
}
