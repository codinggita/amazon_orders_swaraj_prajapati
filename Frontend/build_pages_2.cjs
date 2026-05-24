const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');

const dirs = [
  'orders',
  'analytics',
  'stats',
  'shipping',
  'admin'
].map(d => path.join(pagesDir, d));

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  'orders/OrderDetailPage.jsx': `import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import OrderStatusBadge from '../../components/features/orders/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ordersAPI } from '../../api/orders.api';
import { ArrowLeft, Edit2, Archive, XCircle, Trash2, MapPin, User, CreditCard } from 'lucide-react';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await ordersAPI.getById(orderId);
        setOrder(res.data?.data || res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Spinner center />;
  if (error || !order) return <ErrorState error={error || "Order not found"} onRetry={() => window.location.reload()} />;

  const amount = parseFloat(order.TotalAmount || order.Amount) || 0;
  const discount = parseFloat(order.Discount) || 0;
  const subtotal = amount + discount;

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
      </div>

      <PageHeader 
        title={\`Order #\${order.OrderID || order._id}\`}
        actions={
          <>
            <Button variant="secondary" icon={Edit2}>Edit</Button>
            <Button variant="outline" icon={Archive}>Archive</Button>
            <Button variant="danger" icon={XCircle}>Cancel</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Order Items" padding="p-0">
            <div className="p-4 border-b border-[#2d1515] flex gap-4">
              <div className="w-16 h-16 bg-red-950/30 rounded flex items-center justify-center shrink-0">
                <span className="text-red-500 font-bold text-xs">{order.Category?.substring(0,3)?.toUpperCase() || 'ITM'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{order.ProductName}</p>
                <div className="text-xs text-red-300/60 mt-1 space-y-0.5">
                  <p>Product ID: {order.ProductID}</p>
                  <p>Category: {order.Category}</p>
                  <p>Brand: {order.Brand}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium text-white">{formatCurrency(amount)}</p>
                <p className="text-xs text-red-300/60 mt-1">Qty: {order.Quantity || 1}</p>
              </div>
            </div>
          </Card>

          <Card title="Price Breakdown">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-red-200">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-400">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between text-red-200">
                <span>Shipping</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between text-red-200">
                <span>Tax</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="pt-3 border-t border-[#2d1515] flex justify-between font-bold text-white text-lg">
                <span>Total</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Customer Information">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-700 rounded-full flex items-center justify-center text-white font-bold">
                {order.CustomerName?.[0] || 'C'}
              </div>
              <div>
                <p className="font-medium text-white">{order.CustomerName}</p>
                <p className="text-xs text-red-300/60">ID: {order.CustomerID}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-red-200/80">
              <p className="flex gap-2"><MapPin className="w-4 h-4 text-red-400" /> {order.City}, {order.State}, {order.Country}</p>
            </div>
          </Card>

          <Card title="Order Details">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-red-300/50 mb-1">Status</p>
                <OrderStatusBadge status={order.OrderStatus || 'Pending'} />
              </div>
              <div>
                <p className="text-xs text-red-300/50 mb-1">Payment Method</p>
                <p className="text-sm text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-red-400" /> {order.PaymentMethod || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-red-300/50 mb-1">Order Date</p>
                <p className="text-sm text-white">{formatDate(order.OrderDate)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,
  'analytics/AnalyticsPage.jsx': `import React, { useEffect, useState } from 'react';
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
            name: item._id || item.month,
            value: item.total || item.revenue || 0
          })),
          paymentDist: (payDist.data?.data || []).map(item => ({
            name: item._id || item.method,
            value: item.count || 0
          })),
          topCategories: (topCats.data?.data || []).map(item => ({
            name: item._id || item.category,
            value: item.count || 0
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
      <PageHeader title="Analytics" subtitle="Deep dive into your business metrics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Monthly Revenue">
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
`,
  'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              {/* Fallbacks for other routes so it doesn't crash */}
              <Route path="/stats" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/customers" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/recommendations" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/trending" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/shipping" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/bulk" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/search" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/notifications" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/admin" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
              <Route path="/system" element={<div className="p-8 text-center text-red-300">Coming Soon</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            style: { background: '#1c1112', color: '#fff', border: '1px solid #4b2020' },
            success: { iconTheme: { primary: '#dc2626', secondary: '#fff' } }
          }} 
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(relPath === 'App.jsx' ? srcDir : pagesDir, relPath), content);
}

// Modify main.jsx to use the new App component
const mainPath = path.join(srcDir, 'main.jsx');
const mainContent = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
`;
fs.writeFileSync(mainPath, mainContent);

console.log("Pages chunk 2 and App.jsx created successfully.");
