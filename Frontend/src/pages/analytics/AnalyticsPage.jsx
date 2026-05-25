import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import GlassContent from '../../components/common/GlassContent';
import ErrorState from '../../components/common/ErrorState';
import AreaChart from '../../components/charts/AreaChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import {
  parseMonthlyRevenueChart,
  parseCategoryChart,
  parsePaymentChart,
} from '../../utils/apiHelpers';
import { analyticsAPI } from '../../api/analytics.api';
import SEO from '../../components/common/SEO';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [revMonthly, payDist, topCats] = await Promise.all([
        analyticsAPI.revenueMonthly(),
        analyticsAPI.paymentDistribution(),
        analyticsAPI.topCategories(),
      ]);

      setData({
        revenueChart: parseMonthlyRevenueChart(revMonthly),
        paymentDist: parsePaymentChart(payDist),
        topCategories: parseCategoryChart(topCats),
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (error && !data) {
    return <ErrorState error={error} onRetry={fetchAnalytics} />;
  }

  const revenueChart = data?.revenueChart?.length
    ? data.revenueChart
    : [{ name: 'No data', value: 0 }];
  const topCategories = data?.topCategories?.length
    ? data.topCategories
    : [{ name: 'None', value: 0 }];
  const paymentDist = data?.paymentDist?.length
    ? data.paymentDist
    : [{ name: 'None', value: 1 }];

  return (
    <>
      <SEO
        title="Analytics Dashboard"
        description="Comprehensive analytics dashboard showing revenue trends, payment distribution, top customers, top products, and category performance."
        url="/analytics"
        keywords="order analytics, revenue analytics, amazon analytics, ecommerce analytics dashboard"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "OrderPulse Analytics",
          "description": "Comprehensive order analytics and revenue insights",
          "url": "https://order-pulse-swaraj.vercel.app/analytics"
        }}
      />
      <div>
        <PageHeader title="Analytics" subtitle="Deep dive into your business metrics" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GlassContent loading={loading} minHeight="300px">
            <Card title="Monthly Revenue">
              <AreaChart data={revenueChart} dataKey="value" xKey="name" height={260} />
            </Card>
          </GlassContent>

          <GlassContent loading={loading} minHeight="300px">
            <Card title="Top Categories">
              <BarChart data={topCategories} dataKey="value" xKey="name" color="#ea580c" height={260} />
            </Card>
          </GlassContent>
        </div>

        <GlassContent loading={loading} minHeight="280px">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Payment Distribution">
              <PieChart data={paymentDist} />
            </Card>
          </div>
        </GlassContent>
      </div>
    </>
  );
}
