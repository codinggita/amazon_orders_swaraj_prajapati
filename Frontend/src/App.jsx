import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { createMuiTheme } from './config/muiTheme';
import store from './store';
import ErrorBoundary from './components/common/ErrorBoundary';
import Spinner from './components/common/Spinner';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loading all pages
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const OAuthCallbackPage = React.lazy(() => import('./pages/auth/OAuthCallbackPage'));

const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const OrdersPage = React.lazy(() => import('./pages/orders/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('./pages/orders/OrderDetailPage'));
const AnalyticsPage = React.lazy(() => import('./pages/analytics/AnalyticsPage'));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage'));
const StatsPage = React.lazy(() => import('./pages/stats/StatsPage'));
const CustomersPage = React.lazy(() => import('./pages/customers/CustomersPage'));
const RecommendationsPage = React.lazy(() => import('./pages/recommendations/RecommendationsPage'));
const TrendingPage = React.lazy(() => import('./pages/trending/TrendingPage'));
const ShippingPage = React.lazy(() => import('./pages/shipping/ShippingPage'));
const BulkPage = React.lazy(() => import('./pages/bulk/BulkPage'));
const SearchPage = React.lazy(() => import('./pages/search/SearchPage'));
const NotificationsPage = React.lazy(() => import('./pages/notifications/NotificationsPage'));
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage'));
const AdminPage = React.lazy(() => import('./pages/admin/AdminPage'));
const SystemHealthPage = React.lazy(() => import('./pages/system/SystemHealthPage'));

// A wrapper to pass ThemeContext to MuiThemeProvider
function MuiThemeWrapper({ children }) {
  const { isDark } = useTheme();
  const muiTheme = React.useMemo(() => createMuiTheme(isDark), [isDark]);
  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-(--bg-primary)">
    <Spinner center />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <MuiThemeWrapper>
            <AuthProvider>
              <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auth/callback" element={<OAuthCallbackPage />} />
                  
                  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    <Route path="/trending" element={<TrendingPage />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/bulk" element={<BulkPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/system" element={<SystemHealthPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster
              position="top-right"
              gutter={12}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#1c1112' },
                },
                error: {
                  iconTheme: { primary: '#dc2626', secondary: '#fff' },
                  duration: 5000,
                },
              }}
            />
            </AuthProvider>
          </MuiThemeWrapper>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
