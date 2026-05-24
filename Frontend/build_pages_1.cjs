const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');

const dirs = [
  'auth',
  'dashboard',
  'orders'
].map(d => path.join(pagesDir, d));

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  'auth/LoginPage.jsx': `import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    const success = await login({ email, password });
    if (success) navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="bg-[#111]/80 backdrop-blur-sm border border-[#2d1515] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4 border border-brand-500/30">
            <Activity className="w-7 h-7 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">OrderPulse</h1>
          <p className="text-[10px] tracking-[0.3em] text-red-500/70 uppercase mt-2">The Heartbeat of Your Business</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-red-300/60 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />
          
          <Input 
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30" />
              <span className="text-red-300/70">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full h-11 mt-6" loading={loading}>
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-red-300/60">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Create Account</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
`,
  'auth/RegisterPage.jsx': `import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Activity, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 4) return 1;
    if (pass.length < 8) return 2;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 4;
    return 3;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return toast.error('Please fill in all fields');
    
    const success = await register({ ...formData, confirmPassword: formData.password });
    if (success) navigate('/login');
  };

  return (
    <AuthLayout>
      <div className="bg-[#111]/80 backdrop-blur-sm border border-[#2d1515] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4 border border-brand-500/30">
            <Activity className="w-7 h-7 text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-red-300/60 mt-1">Join OrderPulse today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            required
          />

          <Input 
            label="Email Address"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
          />
          
          <div className="space-y-2">
            <Input 
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onRightIconClick={() => setShowPassword(!showPassword)}
              required
            />
            {/* Password Strength Indicator */}
            <div className="flex gap-1.5 h-1.5 mt-2">
              {[1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  className={\`flex-1 rounded-full transition-colors duration-300 \${
                    strength >= level 
                      ? strength === 1 ? 'bg-red-500' 
                      : strength === 2 ? 'bg-orange-500' 
                      : strength === 3 ? 'bg-amber-400' 
                      : 'bg-green-500'
                      : 'bg-[#2d1515]'
                  }\`} 
                />
              ))}
            </div>
            {strength > 0 && (
              <p className={\`text-[10px] uppercase font-bold tracking-widest text-right \${
                strength === 1 ? 'text-red-500' : strength === 2 ? 'text-orange-500' : strength === 3 ? 'text-amber-400' : 'text-green-500'
              }\`}>
                {strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong'}
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 mt-4 cursor-pointer">
            <input type="checkbox" required className="mt-1 rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30" />
            <span className="text-xs text-red-300/70 leading-relaxed">
              I agree to the <span className="text-brand-400 hover:underline">Terms of Service</span> and <span className="text-brand-400 hover:underline">Privacy Policy</span>
            </span>
          </label>

          <Button type="submit" className="w-full h-11 mt-6" loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-red-300/60">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
`,
  'dashboard/DashboardPage.jsx': `import React, { useEffect, useState } from 'react';
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
    <Card hover className="h-full">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-400/60">{title}</p>
        <div className={\`w-10 h-10 rounded-xl flex items-center justify-center \${colorClass}\`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-sm">
          {trend > 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
          <span className={trend > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>{Math.abs(trend)}%</span>
          <span className="text-red-300/40 ml-1">{trendLabel}</span>
        </div>
      )}
      {!trend && trendLabel && (
        <div className="flex items-center gap-2 mt-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500 font-medium">{trendLabel}</span>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      <PageHeader label="OPERATIONAL DASHBOARD" title="Overview" subtitle="Real-time metrics and insights" />

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
          value={\`\${data.returnRate.toFixed(1)}%\`} 
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
          <Card title="Revenue Velocity" padding="p-5 pb-0">
            <AreaChart data={data.revenueChart.length ? data.revenueChart : [{name:'Jan', value:0}]} dataKey="value" xKey="name" />
          </Card>
        </div>
        <div>
          <Card title="Action Required" padding="p-0">
            <div className="flex justify-between items-center p-4 border-b border-[#2d1515]">
              <span className="text-sm font-medium text-red-200">Recent Orders</span>
              <Link to="/orders" className="text-xs font-medium text-brand-400 hover:text-brand-300">View All</Link>
            </div>
            <div className="divide-y divide-[#2d1515]">
              {data.recentOrders.slice(0, 5).map((order, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-red-950/10 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-white">#{order.OrderID || order._id}</p>
                    <p className="text-xs text-red-300/60">{formatCurrency(order.TotalAmount)}</p>
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
`,
  'orders/OrdersPage.jsx': `import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import OrderFilters from '../../components/features/orders/OrderFilters';
import OrderTable from '../../components/features/orders/OrderTable';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { Search, Plus, Filter, Download } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { ordersAPI } from '../../api/orders.api';
import useDebounce from '../../hooks/useDebounce';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', payment: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, loading, refetch } = useFetch(
    () => ordersAPI.getAll({ page, limit, sort: '-OrderDate', q: debouncedSearch, ...filters }),
    [page, limit, debouncedSearch, filters]
  );

  const orders = data?.orders || data?.data || [];
  const total = data?.total || data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div>
      <PageHeader 
        title="All Orders" 
        actions={
          <>
            <div className="relative mr-2 hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400/50" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1c1112] border border-[#2d1515] rounded-lg h-9 pl-9 pr-4 text-sm text-white placeholder:text-red-300/40 focus:outline-none focus:border-red-600 w-48"
              />
            </div>
            <Button variant="secondary" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
              Filters
            </Button>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button icon={Plus}>New Order</Button>
          </>
        } 
      />

      {showFilters && (
        <OrderFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={() => { setFilters({ status: '', payment: '' }); setPage(1); }} 
        />
      )}

      <OrderTable 
        orders={orders} 
        loading={loading}
        selectedRows={new Set()}
        onSelectRow={() => {}}
        onSelectAll={() => {}}
      />

      <div className="mt-6">
        <Pagination 
          page={page} 
          totalPages={totalPages} 
          total={total} 
          limit={limit} 
          onPageChange={setPage} 
          onLimitChange={(l) => { setLimit(l); setPage(1); }} 
        />
      </div>
    </div>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(pagesDir, relPath), content);
}

console.log("Pages chunk 1 created successfully.");
