import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { systemAPI } from '../../api/system.api';
import { adminAPI } from '../../api/admin.api';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { RefreshCw, ShieldAlert, Server, Database, HardDrive, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

function parseMemoryMb(value) {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  const n = parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function SystemHealthPage() {
  const { isLoggedIn, isAdmin, token } = useAuth();
  const [ping, setPing] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [storageStatus, setStorageStatus] = useState(null);
  const [adminHealth, setAdminHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminDenied, setAdminDenied] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setAdminDenied(false);

    try {
      const pingRes = await systemAPI.ping();
      setPing(pingRes.data?.data || pingRes.data || null);
    } catch {
      setPing(null);
    }

    if (!token) {
      setDbStatus(null);
      setCacheStatus(null);
      setStorageStatus(null);
      setUptime(null);
      setAdminHealth(null);
      setLoading(false);
      setLastRefresh(new Date());
      return;
    }

    const [uptimeRes, dbRes, cacheRes, storageRes, adminRes] = await Promise.all([
      systemAPI.uptime().catch((e) => ({ error: e })),
      systemAPI.dbStatus().catch((e) => ({ error: e })),
      systemAPI.cacheStatus().catch((e) => ({ error: e })),
      systemAPI.storageStatus().catch((e) => ({ error: e })),
      adminAPI.getSystemHealth().catch((e) => ({ error: e })),
    ]);

    const denied =
      [uptimeRes, dbRes, cacheRes, storageRes].some(
        (r) => r?.error?.response?.status === 403 || r?.error?.response?.status === 401
      );
    setAdminDenied(denied && !isAdmin);

    if (!uptimeRes?.error) {
      setUptime(uptimeRes.data?.data || {});
    }
    if (!dbRes?.error) {
      setDbStatus(dbRes.data?.data || {});
    }
    if (!cacheRes?.error) {
      setCacheStatus(cacheRes.data?.data || {});
    }
    if (!storageRes?.error) {
      setStorageStatus(storageRes.data?.data || {});
    }
    if (!adminRes?.error) {
      setAdminHealth(adminRes.data?.data || {});
    }

    setLastRefresh(new Date());
    setLoading(false);
  }, [token, isAdmin]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const dbConnected = dbStatus?.status === 'connected' || dbStatus?.isHealthy;
  const pingOk = ping?.status === 'alive' || ping?.ping === 'pong';
  const isHealthy =
    pingOk &&
    (dbConnected || !token) &&
    (adminHealth?.status === 'healthy' || !adminHealth || dbConnected);

  const heapUsed = parseMemoryMb(uptime?.memoryUsage?.heapUsed);
  const heapTotal = parseMemoryMb(uptime?.memoryUsage?.heapTotal);
  const heapPercent = heapTotal > 0 ? Math.min(100, (heapUsed / heapTotal) * 100) : 0;

  if (loading && !ping) {
    return <Spinner center />;
  }

  return (
    <div>
      <PageHeader
        label="SYSTEM"
        title="System Health"
        subtitle="Real-time infrastructure monitoring"
        actions={
          <div className="flex items-center gap-3">
            <span className="font-badge text-[10px] bg-[#2d1515] px-2 py-1 rounded text-red-300/70">
              Auto-refresh: 30s
            </span>
            <Button variant="secondary" icon={RefreshCw} onClick={fetchAll}>
              <span className="font-btn">Refresh</span>
            </Button>
          </div>
        }
      />

      {!isLoggedIn && (
        <div className="glass-panel border-amber-900/40 rounded-xl p-4 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-[13px] text-amber-200/90 font-medium">Limited view</p>
            <p className="font-body-sm text-amber-200/50 mt-1">
              Sign in as an <span className="text-amber-300">admin</span> to see database, cache, and server metrics.{' '}
              <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      )}

      {isLoggedIn && adminDenied && (
        <div className="glass-panel border-amber-900/40 rounded-xl p-4 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="font-body-sm text-amber-200/60">
            Detailed system metrics require <span className="font-semibold text-amber-300">admin</span> access.
            Basic API ping is shown below.
          </p>
        </div>
      )}

      <div className="glass-panel border-[#4b2020]/60 rounded-xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full shrink-0 ${isHealthy ? 'bg-emerald-500 animate-live' : 'bg-red-500 animate-pulse'}`} />
          <span className={`font-logo text-xl tracking-[-0.03em] ${isHealthy ? 'text-emerald-400 text-glow-green' : 'text-red-400'}`}>
            {isHealthy ? '● SYSTEM HEALTHY' : '● SYSTEM DEGRADED'}
          </span>
        </div>
        <p className="font-timestamp text-[11px] opacity-100 text-red-400/50">
          Last checked: {lastRefresh.toLocaleTimeString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Ping — always available */}
        <Card title="API Server" className="glass-panel border-[#4b2020]/50">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-red-400" />
            <p className={`font-body font-medium ${pingOk ? 'text-emerald-400' : 'text-red-400'}`}>
              {pingOk ? '● Online' : '● Offline'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="kpi-label text-[9px] mb-1">Response</p>
              <p className="font-mono text-[13px] text-white">{ping?.ping || '—'}</p>
            </div>
            <div>
              <p className="kpi-label text-[9px] mb-1">Latency</p>
              <p className="font-mono text-[13px] text-white">{ping?.responseTime || '—'}</p>
            </div>
          </div>
        </Card>

        {/* Database */}
        <Card title="Database" className="glass-panel border-[#4b2020]/50">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-red-400" />
            {!token ? (
              <p className="font-body-sm text-red-300/50">Sign in as admin to view</p>
            ) : (
              <p className={`font-body font-medium ${dbConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                {dbConnected ? '● Connected' : '● Disconnected'}
              </p>
            )}
          </div>
          {dbStatus ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="kpi-label text-[9px] mb-1">Latency</p>
                  <p className="font-metric text-[15px] text-white">{dbStatus.latencyMs ?? '—'}ms</p>
                </div>
                <div>
                  <p className="kpi-label text-[9px] mb-1">Host</p>
                  <p className="font-mono text-[12px] text-white truncate">{dbStatus.host || 'N/A'}</p>
                </div>
              </div>
              {dbStatus.collections && (
                <ul className="space-y-2 font-body-sm text-[13px]">
                  <li className="flex justify-between border-b border-[#2d1515] pb-1">
                    <span className="text-red-200/70">Orders</span>
                    <span className="font-mono tabular-nums text-white">{dbStatus.collections.totalOrders ?? 0}</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span className="text-red-200/70">Users</span>
                    <span className="font-mono tabular-nums text-white">{dbStatus.collections.totalUsers ?? 0}</span>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <p className="font-body-sm text-red-300/40">No data available</p>
          )}
        </Card>

        {/* Cache */}
        <Card title="Cache" className="glass-panel border-[#4b2020]/50">
          <p className={`font-body font-medium mb-4 ${cacheStatus?.isHealthy !== false ? 'text-emerald-400' : 'text-red-400'}`}>
            {cacheStatus ? '● Operational' : '—'}
          </p>
          {cacheStatus ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="kpi-label text-[9px] mb-1">Type</p>
                <p className="font-body text-[13px] text-white">{cacheStatus.type || 'in-memory'}</p>
              </div>
              <div>
                <p className="kpi-label text-[9px] mb-1">Keys</p>
                <p className="font-metric text-[15px] text-white tabular-nums">
                  {cacheStatus.stats?.totalKeys ?? 0}
                </p>
              </div>
              <div className="col-span-2">
                <p className="kpi-label text-[9px] mb-1">Memory est.</p>
                <p className="font-mono text-[12px] text-white">
                  {cacheStatus.stats?.memoryEstimateKB ?? 0} KB
                </p>
              </div>
            </div>
          ) : (
            <p className="font-body-sm text-red-300/40">No data available</p>
          )}
        </Card>

        {/* Storage */}
        <Card title="Storage" className="glass-panel border-[#4b2020]/50">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-red-400" />
            <p className="font-body font-medium text-emerald-400">
              {storageStatus?.isHealthy !== false ? '● Healthy' : '● Check required'}
            </p>
          </div>
          <div className="space-y-4">
            {storageStatus?.storage?.buckets?.length ? (
              storageStatus.storage.buckets.map((b) => (
                <div key={b.name}>
                  <div className="flex justify-between font-body-sm text-[12px] mb-1">
                    <span className="text-red-200/70">{b.name}</span>
                    <span className="font-mono text-red-300/60 tabular-nums">{b.usagePercent}%</span>
                  </div>
                  <div className="w-full bg-[#2d1515] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        b.usagePercent < 50 ? 'bg-emerald-600' : b.usagePercent < 80 ? 'bg-amber-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(100, b.usagePercent || 0)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="font-body-sm text-red-300/40">No storage data</p>
            )}
          </div>
        </Card>

        {/* Server runtime */}
        <Card title="Runtime" className="glass-panel border-[#4b2020]/50 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-red-400" />
            <p className="font-body font-medium text-white">Process metrics</p>
          </div>
          {uptime ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="kpi-label text-[9px] mb-1">Uptime</p>
                <p className="font-metric text-[18px] text-white tabular-nums">
                  {uptime.uptimeFormatted || '—'}
                </p>
              </div>
              <div>
                <p className="kpi-label text-[9px] mb-1">PID</p>
                <p className="font-mono text-[13px] text-white">{uptime.pid ?? '—'}</p>
              </div>
              <div>
                <p className="kpi-label text-[9px] mb-1">Heap used</p>
                <p className="font-mono text-[13px] text-white">{uptime.memoryUsage?.heapUsed || '—'}</p>
              </div>
              <div>
                <p className="kpi-label text-[9px] mb-1">Heap total</p>
                <p className="font-mono text-[13px] text-white">{uptime.memoryUsage?.heapTotal || '—'}</p>
              </div>
            </div>
          ) : (
            <p className="font-body-sm text-red-300/40 mb-4">Runtime metrics require admin access</p>
          )}
          {heapTotal > 0 && (
            <div>
              <p className="kpi-label text-[9px] mb-2">Memory usage</p>
              <div className="w-full bg-[#2d1515] rounded-full h-2 mb-1">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${heapPercent}%` }} />
              </div>
              <p className="font-mono text-[11px] text-red-300/50 text-right tabular-nums">
                {heapUsed.toFixed(1)} MB / {heapTotal.toFixed(1)} MB
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
