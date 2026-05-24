import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import AreaChart from '../../components/charts/AreaChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { formatCurrency } from '../../utils/formatters';
import { analyticsAPI } from '../../api/analytics.api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [revMonthly, payDist, topCats] = await Promise.all([
          analyticsAPI.revenueMonthly().catch(() => ({ data: { data: [] } })),
          analyticsAPI.paymentDistribution().catch(() => ({ data: { data: [] } })),
          analyticsAPI.topCategories().catch(() => ({ data: { data: [] } }))
        ]);

        setData({
          revenueChart: (revMonthly.data?.data || []).map(item => ({
            name: item.month,
            value: item.totalRevenue || 0
          })),
          paymentDist: (payDist.data?.data || []).map(item => ({
            name: item.paymentMethod,
            value: item.orderCount || 0
          })),
          topCategories: (topCats.data?.data || []).map(item => ({
            name: item.category,
            value: item.totalRevenue || 0
          }))
        });
      } catch (err) {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Spinner center />;
  if (error) return <ErrorState error={error} />;

  return (
    <div>
      <PageHeader
        label="INSIGHTS"
        title="Analytics"
        subtitle="Deep dive into your business metrics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Monthly Revenue" className="glass-panel border-[#4b2020]/50">
          <AreaChart data={data.revenueChart.length ? data.revenueChart : [{name:'Jan', value:0}]} dataKey="value" />
        </Card>
        
        <Card title="Top Categories">
          <BarChart data={data.topCategories.length ? data.topCategories : [{name:'None', value:0}]} dataKey="value" color="#ea580c" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Payment Distribution">
          <PieChart data={data.paymentDist.length ? data.paymentDist : [{name:'None', value:1}]} />
        </Card>
      </div>
    </div>
  );
}
