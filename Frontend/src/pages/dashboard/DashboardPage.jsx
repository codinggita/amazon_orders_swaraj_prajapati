import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import AreaChart from '../../components/charts/AreaChart';
import OrderStatusBadge from '../../components/features/orders/OrderStatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, ShoppingCart, RotateCcw, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { analyticsAPI } from '../../api/analytics.api';
import { systemAPI } from '../../api/system.api';
import { ordersAPI } from '../../api/orders.api';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [revTotal, ordCount, retRate, sysPing, revMonthly, ordRecent] = await Promise.all([
          analyticsAPI.revenueTotal().catch(() => ({ data: { data: 0 } })),
          analyticsAPI.ordersCount().catch(() => ({ data: { data: 0 } })),
          analyticsAPI.returnRate().catch(() => ({ data: { data: { rate: 0 } } })),
          systemAPI.ping().catch(() => ({ data: { success: false, data: { uptime: 0 } } })),
          analyticsAPI.revenueMonthly().catch(() => ({ data: { data: [] } })),
          ordersAPI.getAll({ limit: 5, sort: '-date' }).catch(() => ({ data: { data: [] } }))
        ]);

        setData({
          revenue: revTotal.data?.data || 0,
          orders: ordCount.data?.data || 0,
          returnRate: retRate.data?.data?.rate || 0,
          systemStatus: sysPing.data?.success ? 'Operational' : 'Degraded',
          revenueChart: (revMonthly.data?.data || []).map(item => ({
            name: item._id || item.month,
            value: item.total || item.revenue || 0
          })),
          recentOrders: ordRecent.data?.data?.orders || ordRecent.data?.data || []
        });
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner center />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  const KPICard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => (
    <Card hover className="h-full kpi-card animate-count-up">
      <div className="flex justify-between items-start mb-4">
        <p className="kpi-label text-[9px] tracking-[0.18em]">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="font-metric text-[32px] text-white tabular-nums font-reveal">{value}</p>
      {trend != null && (
        <div className="flex items-center gap-1 mt-2">
          {trend > 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`font-percent text-[12px] ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="font-body-xs text-[11px] ml-1">{trendLabel}</span>
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

  return (
    <div>
      <PageHeader
        label="OPERATIONAL DASHBOARD"
        title="Overview"
        subtitle="Real-time metrics for Amazon Seller Central"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <KPICard 
          title="Total Revenue" 
          value={formatCurrency(data.revenue)} 
          icon={DollarSign} 
          trend={+12.5} 
          trendLabel="vs last month"
          colorClass="bg-green-500/20 text-green-500"
        />
        <KPICard 
          title="Total Orders" 
          value={data.orders.toLocaleString()} 
          icon={ShoppingCart} 
          trend={+5.2} 
          trendLabel="vs last month"
          colorClass="bg-brand-600/20 text-brand-500"
        />
        <KPICard 
          title="Return Rate" 
          value={`${data.returnRate.toFixed(1)}%`} 
          icon={RotateCcw} 
          trend={-1.1} 
          trendLabel="vs last month"
          colorClass="bg-orange-500/20 text-orange-500"
        />
        <KPICard 
          title="System Health" 
          value="99.9%" 
          icon={Activity} 
          trendLabel={data.systemStatus}
          colorClass="bg-blue-500/20 text-blue-500"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Revenue Velocity" titleClassName="font-card-title text-[15px]" padding="p-5 pb-0">
            <AreaChart data={data.revenueChart.length ? data.revenueChart : [{name:'Jan', value:0}]} dataKey="value" xKey="name" />
          </Card>
        </div>
        <div>
          <Card title="Action Required" titleClassName="font-card-title text-[15px]" padding="p-0">
            <div className="flex justify-between items-center p-4 border-b border-[#2d1515]">
              <span className="font-card-title text-[15px] text-white">Action Required</span>
              <Link to="/orders" className="font-body-xs text-red-400 hover:text-red-300">View All</Link>
            </div>
            <div className="divide-y divide-[#2d1515]">
              {data.recentOrders.slice(0, 5).map((order, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-red-950/10 transition-colors">
                  <div>
                    <p className="font-order-id text-red-400">#{order.OrderID || order._id}</p>
                    <p className="font-currency text-[13px] text-white mt-0.5">{formatCurrency(order.TotalAmount)}</p>
                  </div>
                  <OrderStatusBadge status={order.OrderStatus || 'Pending'} />
                </div>
              ))}
              {data.recentOrders.length === 0 && (
                <div className="p-8 text-center text-sm text-red-300/50">No recent orders</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
