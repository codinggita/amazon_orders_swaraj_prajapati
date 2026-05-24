import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { getInitials, formatDate } from '../../utils/formatters';
import { Users, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stats/customers/list', {
        params: { q: searchQuery, page, limit }
      });
      const data = res.data?.data || {};
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } catch { 
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCustomers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  return (
    <div>
      <PageHeader 
        label="CRM" 
        title="Customers" 
        subtitle="Manage customer relationships" 
        actions={<Button variant="secondary" icon={Download}>Export CSV</Button>}
      />

      <Card padding="p-0">
        <div className="p-4 border-b border-[#2d1515] flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400/50" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111] border border-[#2d1515] rounded-lg h-9 w-full pl-9 pr-4 text-sm text-white focus:outline-none focus:border-red-600"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto relative min-h-[300px]">
          {loading && <Spinner overlay size="lg" />}
          <table className="w-full text-left">
            <thead className="bg-[#2d1515]">
              <tr>
                <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Customer</th>
                <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Orders</th>
                <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Total Spent</th>
                <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Last Order</th>
                <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d1515]">
              {customers.length === 0 && !loading ? (
                <tr><td colSpan="5"><EmptyState icon={Users} title="No customers found" /></td></tr>
              ) : customers.map((c, i) => (
                <tr key={i} className="hover:bg-red-950/10">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center text-xs">{getInitials(c.name || 'C')}</div>
                    <div>
                      <span className="text-sm text-white block">{c.name || 'Unknown'}</span>
                      <span className="text-xs text-red-300/60">{c.email || 'No email'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{c.ordersCount || 0}</td>
                  <td className="px-4 py-3 text-sm text-white">{c.totalSpent || 0}</td>
                  <td className="px-4 py-3 text-sm text-red-300/60">{formatDate(c.lastOrderDate) || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-green-900/40 text-green-400 px-2 py-0.5 rounded text-xs">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4"><Pagination page={page} totalPages={Math.ceil(total/limit) || 1} total={total} limit={limit} onPageChange={setPage} /></div>
      </Card>
    </div>
  );
}
