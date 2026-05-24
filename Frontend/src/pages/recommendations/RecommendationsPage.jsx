import React, { useState } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { Search, Lightbulb, PackageX, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('customer');
  const [customerId, setCustomerId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [basedOn, setBasedOn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchByCustomer = async () => {
    if (!customerId.trim()) return toast.error('Please enter a Customer ID');
    setLoading(true); setSearched(true);
    try {
      const res = await api.get('/recommendations/products/' + customerId);
      const data = res.data?.data || res.data || {};
      setRecommendations(data.recommendations || []);
      setBasedOn(data.basedOn || data);
    } catch (err) {
      toast.error('Failed to fetch recommendations');
      setRecommendations([]);
    } finally { setLoading(false); }
  };

  const fetchByOrder = async () => {
    if (!orderId.trim()) return toast.error('Please enter an Order ID');
    setLoading(true); setSearched(true);
    try {
      const res = await api.get('/recommendations/orders/' + orderId);
      const data = res.data?.data || res.data || {};
      setRecommendations(data.recommendations || data.similarProducts || []);
      setBasedOn(data.sourceOrder || data.basedOn || data);
    } catch (err) {
      toast.error('Failed to fetch recommendations');
      setRecommendations([]);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader label="AI RECOMMENDATIONS" title="Recommendations" subtitle="Personalized product recommendations based on order history" />

      <div className="flex gap-2 mb-6 border-b border-[#2d1515] pb-2">
        <button onClick={() => {setActiveTab('customer'); setSearched(false);}} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'customer' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300 bg-[#1c1112] border border-[#2d1515]'}`}>By Customer</button>
        <button onClick={() => {setActiveTab('order'); setSearched(false);}} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'order' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300 bg-[#1c1112] border border-[#2d1515]'}`}>By Order</button>
      </div>

      <div className="flex gap-3 mb-6">
        <input 
          type="text" 
          value={activeTab === 'customer' ? customerId : orderId} 
          onChange={e => activeTab === 'customer' ? setCustomerId(e.target.value) : setOrderId(e.target.value)}
          placeholder={`Enter ${activeTab === 'customer' ? 'Customer' : 'Order'} ID...`}
          className="bg-[#1c1112] border border-[#2d1515] rounded-lg px-4 py-3 text-white w-full max-w-md focus:outline-none focus:border-red-600"
          onKeyDown={e => e.key === 'Enter' && (activeTab === 'customer' ? fetchByCustomer() : fetchByOrder())}
        />
        <Button icon={Search} onClick={activeTab === 'customer' ? fetchByCustomer : fetchByOrder} loading={loading}>Get Recommendations</Button>
      </div>

      {searched && basedOn && !loading && (
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-4 mb-6 text-sm text-red-300/60">
          Based on analysis of order history. {basedOn.totalOrdersAnalyzed ? `${basedOn.totalOrdersAnalyzed} orders analyzed.` : ''}
        </div>
      )}

      {!searched ? (
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-12 text-center mt-8">
          <Lightbulb className="w-12 h-12 text-red-800 mx-auto mb-4" />
          <p className="text-red-300/50">Enter a {activeTab} ID to see personalized recommendations</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-red-950/20 rounded-xl border border-[#2d1515] animate-pulse"></div>)}
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState icon={PackageX} title="No recommendations found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendations.map((item, idx) => (
            <div key={idx} className="bg-[#111]/60 border border-[#2d1515] rounded-xl overflow-hidden hover:border-red-700/50 transition-all">
              <div className="w-full h-40 bg-gradient-to-br from-red-900/30 to-red-950/60 flex items-center justify-center">
                <Package className="w-8 h-8 text-red-400/50" />
              </div>
              <div className="p-4">
                <p className="font-medium text-white text-sm truncate">{item.productName || item.ProductName || item.name}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-red-950 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-900">{item.category || item.Category || 'Product'}</span>
                  {item.brand || item.Brand && <span className="bg-red-950 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-900">{item.brand || item.Brand}</span>}
                </div>
                <p className="text-red-400 font-bold mt-2">{formatCurrency(item.price || item.Price || 0)}</p>
                {item.reason && <p className="text-xs italic text-red-300/50 mt-2">{item.reason}</p>}
                {item.score !== undefined && (
                  <div className="w-full bg-[#2d1515] rounded-full h-1 mt-3">
                    <div className="bg-red-600 h-1 rounded-full" style={{ width: `${Math.min(100, item.score * 100)}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
