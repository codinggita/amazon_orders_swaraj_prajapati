import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ProfilePage from './pages/profile/ProfilePage';
import StatsPage from './pages/stats/StatsPage';
import CustomersPage from './pages/customers/CustomersPage';
import RecommendationsPage from './pages/recommendations/RecommendationsPage';
import TrendingPage from './pages/trending/TrendingPage';
import ShippingPage from './pages/shipping/ShippingPage';
import BulkPage from './pages/bulk/BulkPage';
import SearchPage from './pages/search/SearchPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AdminPage from './pages/admin/AdminPage';
import SystemHealthPage from './pages/system/SystemHealthPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
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
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/system" element={<SystemHealthPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1c1112',
              color: '#fef2f2',
              border: '1px solid #4b2020',
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
    </ThemeProvider>
  );
}
