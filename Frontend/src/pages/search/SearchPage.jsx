import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate, getInitials } from '../../utils/formatters';
import { Search, SearchX, Clock, TrendingUp, X } from 'lucide-react';
import { STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';

const SEARCH_TYPES = [
  { key: 'all', label: 'All Fields' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'status', label: 'Status' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
];

const ENDPOINTS = {
  all: '/orders/search',
  customer: '/orders/search/customer',
  product: '/orders/search/product',
  category: '/orders/search/category',
  brand: '/orders/search/brand',
  status: '/orders/search/status',
  location: '/orders/search/location',
  date: '/orders/search/date',
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);

  useEffect(() => {
    api.get('/orders/search/recent').then(r => setRecentSearches(r.data?.data || [])).catch(() => {});
    api.get('/orders/search/popular').then(r => setPopularSearches(r.data?.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await api.get(ENDPOINTS[searchType] || ENDPOINTS.all, { params: { q: query } });
        setResults(res.data?.data || []);
      } catch { toast.error('Search failed'); }
      finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, searchType]);

  return (
    <div>
      <PageHeader label="SEARCH" title="Advanced Search" subtitle="Find any order across all fields" />

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-2xl p-1 flex items-center">
          <div className="pl-4 pr-2"><Search className="w-6 h-6 text-red-400/50" /></div>
          <input 
            type="text" 
            value={query} 
            onChange={e=>setQuery(e.target.value)} 
            placeholder="Search orders, customers, products..." 
            className="h-14 w-full bg-transparent text-lg text-white placeholder:text-red-300/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="pr-4 text-red-400/50 hover:text-red-300">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {SEARCH_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => setSearchType(type.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${searchType === type.key ? 'bg-red-600 text-white' : 'bg-[#1c1112] border border-[#2d1515] text-red-300/70 hover:text-red-200'}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {!searched && !query ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-red-200"><Clock className="w-5 h-5"/> <h3>Recent Searches</h3></div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s, i) => (
                  <button key={i} onClick={()=>setQuery(s.query || s)} className="bg-[#1c1112] border border-[#2d1515] rounded-full px-3 py-1 text-sm text-red-300 hover:border-red-700">
                    {s.query || s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {popularSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-red-200"><TrendingUp className="w-5 h-5"/> <h3>Popular Searches</h3></div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((s, i) => (
                  <button key={i} onClick={()=>setQuery(s._id || s.query || s)} className="bg-[#1c1112] border border-[#2d1515] rounded-full px-3 py-1 text-sm text-red-300 hover:border-red-700 flex items-center gap-2">
                    <span>{s._id || s.query || s}</span>
                    {s.count && <span className="bg-red-900/40 text-red-400 text-[10px] px-1.5 rounded">{s.count}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2d1515] bg-[#1c1112]">
            <p className="text-sm text-red-300/70">{results.length} results found for "{query}"</p>
          </div>
          {loading ? (
            <div className="divide-y divide-[#2d1515]">
              {Array(5).fill(0).map((_, i) => <div key={i} className="p-4"><div className="h-10 bg-red-950/30 animate-pulse rounded"></div></div>)}
            </div>
          ) : results.length === 0 ? (
            <EmptyState icon={SearchX} title="No results found" description="Try a different search term or filter" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#2d1515]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Order ID</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Customer</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Product</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Category</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Amount</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Status</th>
                    <th className="px-4 py-3 text-[10px] uppercase text-red-300/70">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d1515]">
                  {results.map(o => (
                    <tr key={o._id || o.OrderID} className="hover:bg-red-950/10 cursor-pointer" onClick={() => navigate(`/orders/${o.OrderID || o._id}`)}>
                      <td className="px-4 py-3 text-sm font-mono text-red-400 hover:underline">{o.OrderID || o._id}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-800 text-white flex items-center justify-center text-xs">{getInitials(o.CustomerName)}</div>
                        <span className="text-sm text-white">{o.CustomerName}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-200/80 truncate max-w-[150px]">{o.ProductName}</td>
                      <td className="px-4 py-3 text-sm text-red-300/60">{o.Category}</td>
                      <td className="px-4 py-3 text-sm text-white font-mono">{formatCurrency(o.TotalAmount)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[o.OrderStatus] || 'bg-red-900/40 text-red-400'}`}>{o.OrderStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-300/60">{formatDate(o.OrderDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
