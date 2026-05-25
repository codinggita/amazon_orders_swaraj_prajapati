import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getInitials } from '../../utils/formatters';
import { Shield, Ban, CheckCircle, Database, Server, Clock, HardDrive, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  
  // Dialogs
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // System State
  const [systemHealth, setSystemHealth] = useState(null);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);

  // Reports
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'system') fetchSystem();
  }, [activeTab, usersPage, ordersPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { page: usersPage, limit: 10, search: userSearch } });
      setUsers(res.data?.data || []);
      setUsersTotal(res.data?.total || 0);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders', { params: { page: ordersPage, limit: 10 } });
      setOrders(res.data?.data || []);
      setOrdersTotal(res.data?.total || 0);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const fetchSystem = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/system/health');
      setSystemHealth(res.data?.data || res.data);
    } catch { toast.error('Failed to load system health'); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch('/admin/users/' + id + '/role', { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const toggleBanStatus = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const endpoint = selectedUser.isActive ? '/ban' : '/unban';
      await api.patch('/admin/users/' + selectedUser._id + endpoint);
      toast.success(`User ${selectedUser.isActive ? 'banned' : 'unbanned'}`);
      setConfirmDialog(false);
      fetchUsers();
    } catch { toast.error('Action failed'); }
    finally { setLoading(false); }
  };

  const generateReport = async (type) => {
    setLoading(true);
    setReportData(null);
    try {
      const res = await api.get('/admin/reports/' + type);
      setReportData(res.data?.data || res.data);
      toast.success('Report generated');
    } catch { toast.error('Failed to generate report'); }
    finally { setLoading(false); }
  };

  const saveMaintenance = async () => {
    try {
      await api.post('/admin/system/maintenance', { enabled: maintenanceEnabled, message: maintenanceMsg });
      toast.success('Maintenance mode updated');
    } catch { toast.error('Failed to update maintenance mode'); }
  };

  if (!isAdmin) {
    return (
      <>
        <SEO
          title="Admin Panel"
          description="Administrator panel for managing users, viewing reports, monitoring system health, and configuring settings."
          url="/admin"
          noIndex={true}
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Shield className="w-16 h-16 text-red-800/50 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-red-300/60">You need admin privileges to access this page.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Admin Panel"
        description="Administrator panel for managing users, viewing reports, monitoring system health, and configuring settings."
        url="/admin"
        noIndex={true}
      />
      <div>
        <PageHeader label="ADMIN" title="Admin Panel" subtitle="Manage users, system, and reports" />

        <div className="flex gap-2 mb-6 border-b border-[#2d1515] pb-2 overflow-x-auto">
          {['users', 'orders', 'reports', 'system'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300 bg-[#1c1112] border border-[#2d1515]'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <Card padding="p-0">
            <div className="p-4 border-b border-[#2d1515] flex gap-4">
              <input 
                type="text" 
                placeholder="Search users..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="bg-[#111] border border-[#2d1515] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
              />
              <Button onClick={fetchUsers}>Search</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#2d1515]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Name</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Email</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Role</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Status</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d1515]">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center"><Spinner center /></td></tr>
                  ) : users.map(u => (
                    <tr key={u._id} className="hover:bg-red-950/10">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-800 text-white flex items-center justify-center text-xs">{getInitials(u.name)}</div>
                        <span className="text-sm text-white">{u.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-200/80">{u.email}</td>
                      <td className="px-4 py-3">
                        <Select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`w-28 text-xs ${u.role==='admin' ? 'bg-red-900 border-red-700 text-red-300' : 'bg-[#2d1515] border-[#4b2020] text-red-400'}`}
                          options={[
                            { value: 'user', label: 'User' },
                            { value: 'admin', label: 'Admin' }
                          ]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${u.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                          {u.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          size="sm" 
                          variant={u.isActive ? 'danger' : 'primary'} 
                          onClick={() => { setSelectedUser(u); setConfirmDialog(true); }}
                        >
                          {u.isActive ? 'Ban' : 'Unban'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={usersPage} totalPages={Math.ceil(usersTotal/10)} total={usersTotal} limit={10} onPageChange={setUsersPage} /></div>
          </Card>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Sales Report" className="text-center">
              <Button onClick={() => generateReport('sales')} loading={loading} className="w-full mb-4">Generate Sales Report</Button>
            </Card>
            <Card title="Revenue Report" className="text-center">
              <Button onClick={() => generateReport('revenue')} loading={loading} variant="secondary" className="w-full mb-4">Generate Revenue Report</Button>
            </Card>
            {reportData && (
              <div className="md:col-span-2">
                <Card title="Report Results">
                  <pre className="bg-[#111] p-4 rounded text-xs text-green-400 overflow-x-auto">
                    {JSON.stringify(reportData, null, 2)}
                  </pre>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'system' && systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="System Health">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${systemHealth.mongoStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-semibold ${systemHealth.mongoStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                    {systemHealth.mongoStatus === 'connected' ? 'HEALTHY' : 'DEGRADED'}
                  </span>
                </div>
                <p className="text-sm text-red-200">Uptime: <span className="text-white">{Math.floor(systemHealth.uptimeSeconds / 3600)}h {Math.floor((systemHealth.uptimeSeconds%3600)/60)}m</span></p>
                <p className="text-sm text-red-200">Node: <span className="text-white">{systemHealth.nodeVersion || process.version}</span></p>
                <p className="text-sm text-red-200">MongoDB: <span className="text-white">{systemHealth.mongoStatus}</span></p>
                {systemHealth.memoryUsage && (
                  <div>
                    <p className="text-xs text-red-300/60 mb-1">Memory Usage</p>
                    <div className="w-full bg-[#2d1515] rounded-full h-2">
                      <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${(systemHealth.memoryUsage.heapUsed / systemHealth.memoryUsage.heapTotal) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card title="Maintenance Mode">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={maintenanceEnabled} onChange={e => setMaintenanceEnabled(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm text-white">Enable Maintenance Mode</span>
                </label>
                {maintenanceEnabled && (
                  <textarea 
                    value={maintenanceMsg} 
                    onChange={e => setMaintenanceMsg(e.target.value)}
                    placeholder="Maintenance message to display..."
                    className="w-full bg-[#111] border border-[#2d1515] rounded p-2 text-sm text-white focus:outline-none focus:border-red-600"
                    rows="3"
                  />
                )}
                <Button onClick={saveMaintenance}>Save Settings</Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card padding="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#2d1515]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Order ID</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Customer</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Amount</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d1515]">
                  {loading ? <tr><td colSpan="4" className="p-8 text-center"><Spinner center /></td></tr> : orders.map(o => (
                    <tr key={o._id} className="hover:bg-red-950/10">
                      <td className="px-4 py-3 text-sm text-red-400 font-mono">{o.OrderID || o._id}</td>
                      <td className="px-4 py-3 text-sm text-white">{o.CustomerName}</td>
                      <td className="px-4 py-3 text-sm text-white">{o.TotalAmount}</td>
                      <td className="px-4 py-3 text-sm text-red-200/80">{o.OrderStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={ordersPage} totalPages={Math.ceil(ordersTotal/10)} total={ordersTotal} limit={10} onPageChange={setOrdersPage} /></div>
          </Card>
        )}

        <ConfirmDialog 
          show={confirmDialog} 
          onClose={() => setConfirmDialog(false)} 
          onConfirm={toggleBanStatus} 
          title={selectedUser?.isActive ? "Ban User" : "Unban User"} 
          message={`Are you sure you want to ${selectedUser?.isActive ? 'ban' : 'unban'} ${selectedUser?.name}?`}
          confirmText={selectedUser?.isActive ? "Ban" : "Unban"}
          danger={selectedUser?.isActive}
          loading={loading}
        />
      </div>
    </>
  );
}
