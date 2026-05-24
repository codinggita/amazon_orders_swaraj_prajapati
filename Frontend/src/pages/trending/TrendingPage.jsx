import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Select from '../../components/common/Select';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Flame } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/trending/products', { params: { limit } }).catch(() => ({ data: { data: [] } })),
          api.get('/trending/categories', { params: { limit } }).catch(() => ({ data: { data: [] } })),
        ]);
        setProducts(prodRes.data?.data || []);
        setCategories(catRes.data?.data || []);
      } catch { toast.error('Failed to load trending data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [limit]);

  const maxScore = Math.max(...products.map(p => p.trendingScore || 1));
  const maxOrders = Math.max(...categories.map(c => c.orderCount || 1));

  return (
    <div>
      <PageHeader label="TRENDING" title="Trending" subtitle="Discover what's popular right now" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-[#2d1515] pb-2">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300 bg-[#1c1112] border border-[#2d1515]'}`}>Trending Products</button>
          <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300 bg-[#1c1112] border border-[#2d1515]'}`}>Trending Categories</button>
        </div>
        <div className="w-32 self-end md:self-auto">
          <Select 
            value={limit} 
            onChange={e => setLimit(Number(e.target.value))} 
            options={[
              { value: 10, label: 'Top 10' },
              { value: 25, label: 'Top 25' },
              { value: 50, label: 'Top 50' }
            ]}
          />
        </div>
      </div>

      {loading ? <Spinner center /> : activeTab === 'products' ? (
        products.length === 0 ? <EmptyState icon={Flame} title="No trending products" /> : (
          <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#2d1515]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Rank</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Product</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Category</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Brand</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Orders</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Qty Sold</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Revenue</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Score</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d1515]">
                  {products.map((p, i) => {
                    const rank = i + 1;
                    return (
                      <tr key={p._id || p.id || i} className="hover:bg-red-950/10">
                        <td className="px-4 py-3 text-sm">
                          {rank <= 3 ? <span className="text-red-400 font-bold text-lg">🔥 {rank}</span> : rank <= 6 ? <span className="text-orange-400 font-semibold">📈 {rank}</span> : <span className="text-red-300/60">{rank}</span>}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-white truncate max-w-[200px]">{p.ProductName || p.productName || p.name}</td>
                        <td className="px-4 py-3"><span className="bg-red-950 text-red-300 text-xs px-2 py-0.5 rounded border border-red-900">{p.Category || p.category || '-'}</span></td>
                        <td className="px-4 py-3 text-sm text-red-200/70">{p.Brand || p.brand || '-'}</td>
                        <td className="px-4 py-3 text-sm font-mono text-white">{p.orderCount || 0}</td>
                        <td className="px-4 py-3 text-sm font-mono text-red-200">{p.totalQuantity || 0}</td>
                        <td className="px-4 py-3 text-sm font-mono text-white">{formatCurrency(p.totalRevenue || 0)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-mono">{Math.round(p.trendingScore || 0)}</span>
                            <div className="w-16 bg-[#2d1515] rounded-full h-1.5"><div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${((p.trendingScore || 0) / maxScore) * 100}%` }}></div></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">
                          {rank <= 3 ? <span className="text-green-400">↑↑</span> : rank <= 6 ? <span className="text-green-400">↑</span> : rank <= 9 ? <span className="text-amber-400">→</span> : <span className="text-red-400">↓</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        categories.length === 0 ? <EmptyState icon={Flame} title="No trending categories" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((c, i) => {
              const rank = i + 1;
              return (
                <div key={c._id || c.category || i} className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-5 hover:border-red-700/50 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">{c._id || c.category}</h3>
                    {rank <= 3 ? <span className="bg-red-900/60 text-red-300 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">🔥 Hot</span> : rank <= 6 ? <span className="bg-green-900/60 text-green-300 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">📈 Rising</span> : <span className="bg-[#2d1515] text-red-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">📊 Stable</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[10px] text-red-300/50 uppercase tracking-wider mb-1">Orders</p><p className="text-lg font-semibold text-white">{formatNumber(c.orderCount || 0)}</p></div>
                    <div><p className="text-[10px] text-red-300/50 uppercase tracking-wider mb-1">Revenue</p><p className="text-lg font-semibold text-white">{formatCurrency(c.totalRevenue || 0)}</p></div>
                    <div><p className="text-[10px] text-red-300/50 uppercase tracking-wider mb-1">Products</p><p className="text-lg font-semibold text-white">{formatNumber(c.uniqueProductCount || 0)}</p></div>
                    <div><p className="text-[10px] text-red-300/50 uppercase tracking-wider mb-1">Brands</p><p className="text-lg font-semibold text-white">{formatNumber(c.uniqueBrandCount || 0)}</p></div>
                  </div>
                  <div className="w-full bg-[#2d1515] rounded-full h-1.5 mt-4">
                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${((c.orderCount || 0) / maxOrders) * 100}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
