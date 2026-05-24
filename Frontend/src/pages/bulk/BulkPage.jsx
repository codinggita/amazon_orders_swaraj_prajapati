import React, { useState } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { RefreshCw, Archive, RotateCcw, Percent, Trash2, Eraser } from 'lucide-react';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function BulkPage() {
  const [bulkStatusText, setBulkStatusText] = useState('');
  const [bulkStatus, setBulkStatus] = useState('Shipped');
  const [bulkArchive, setBulkArchive] = useState('');
  const [bulkRestore, setBulkRestore] = useState('');
  const [bulkDiscount, setBulkDiscount] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [bulkDelete, setBulkDelete] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [cleanupDate, setCleanupDate] = useState('');
  const [loadingObj, setLoadingObj] = useState({});
  const [results, setResults] = useState(null);

  const parseIds = (text) => text.split('\n').map(s => s.trim()).filter(Boolean);

  const handleOp = async (key, endpoint, method, payload, params) => {
    setLoadingObj(prev => ({...prev, [key]: true}));
    setResults(null);
    try {
      const config = {};
      if (params) config.params = params;
      if (method === 'delete') config.data = payload;
      
      let res;
      if (method === 'patch') res = await api.patch(endpoint, payload, config);
      else if (method === 'post') res = await api.post(endpoint, payload, config);
      else if (method === 'delete') res = await api.delete(endpoint, config);
      
      toast.success('Bulk operation successful');
      setResults(res.data?.data || res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoadingObj(prev => ({...prev, [key]: false}));
    }
  };

  return (
    <div>
      <PageHeader label="BULK OPERATIONS" title="Bulk Operations" subtitle="Perform batch actions on multiple orders" />

      {results && (
        <div className="bg-[#111]/80 border border-green-800 rounded-xl p-4 mb-6 shadow-lg shadow-green-900/20">
          <h3 className="font-semibold text-green-400 mb-2">Operation Complete</h3>
          <pre className="text-xs text-red-200/80 overflow-x-auto">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Status */}
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400"><RefreshCw className="w-5 h-5"/></div>
            <div>
              <h3 className="font-card-title text-white">Update Status</h3>
              <p className="text-xs text-red-300/50">Update multiple order statuses</p>
            </div>
          </div>
          <textarea value={bulkStatusText} onChange={e=>setBulkStatusText(e.target.value)} placeholder="Order IDs (one per line)" className="w-full bg-[#1c1112] border border-[#2d1515] rounded p-2 text-sm text-white h-24 mb-3 focus:outline-none focus:border-red-600" />
          <Select 
            value={bulkStatus} 
            onChange={e=>setBulkStatus(e.target.value)} 
            className="mb-4"
            options={ORDER_STATUSES}
          />
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleOp('status', '/orders/bulk/status', 'patch', { orderIDs: parseIds(bulkStatusText), status: bulkStatus })} loading={loadingObj.status}>Update Status</Button>
        </div>

        {/* Archive */}
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400"><Archive className="w-5 h-5"/></div>
            <div>
              <h3 className="font-card-title text-white">Archive Orders</h3>
              <p className="text-xs text-red-300/50">Move orders to archive</p>
            </div>
          </div>
          <textarea value={bulkArchive} onChange={e=>setBulkArchive(e.target.value)} placeholder="Order IDs (one per line)" className="w-full bg-[#1c1112] border border-[#2d1515] rounded p-2 text-sm text-white h-24 mb-4 focus:outline-none focus:border-red-600" />
          <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-10" onClick={() => handleOp('archive', '/orders/bulk/archive', 'patch', { orderIDs: parseIds(bulkArchive) })} loading={loadingObj.archive}>Archive Orders</Button>
        </div>

        {/* Restore */}
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400"><RotateCcw className="w-5 h-5"/></div>
            <div>
              <h3 className="font-card-title text-white">Restore Orders</h3>
              <p className="text-xs text-red-300/50">Restore archived orders</p>
            </div>
          </div>
          <textarea value={bulkRestore} onChange={e=>setBulkRestore(e.target.value)} placeholder="Order IDs (one per line)" className="w-full bg-[#1c1112] border border-[#2d1515] rounded p-2 text-sm text-white h-24 mb-4 focus:outline-none focus:border-red-600" />
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 mt-10" onClick={() => handleOp('restore', '/orders/bulk/restore', 'patch', { orderIDs: parseIds(bulkRestore) })} loading={loadingObj.restore}>Restore Orders</Button>
        </div>

        {/* Discount */}
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400"><Percent className="w-5 h-5"/></div>
            <div>
              <h3 className="font-card-title text-white">Apply Discount</h3>
              <p className="text-xs text-red-300/50">Apply % discount</p>
            </div>
          </div>
          <textarea value={bulkDiscount} onChange={e=>setBulkDiscount(e.target.value)} placeholder="Order IDs (one per line)" className="w-full bg-[#1c1112] border border-[#2d1515] rounded p-2 text-sm text-white h-24 mb-3 focus:outline-none focus:border-red-600" />
          <div className="flex items-center gap-4 mb-4">
            <input type="range" min="1" max="50" value={discountPercent} onChange={e=>setDiscountPercent(e.target.value)} className="flex-1" />
            <span className="text-white font-bold">{discountPercent}%</span>
          </div>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 mt-1" onClick={() => handleOp('discount', '/orders/bulk/apply-discount', 'post', { orderIDs: parseIds(bulkDiscount), discountPercent })} loading={loadingObj.discount}>Apply Discount</Button>
        </div>

        {/* Delete */}
        <div className="bg-[#111]/60 border border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400"><Trash2 className="w-5 h-5"/></div>
            <div>
              <h3 className="font-card-title text-white">Delete Orders</h3>
              <p className="text-xs text-red-300/50">Permanently delete orders</p>
            </div>
          </div>
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 text-xs text-red-300 mb-3">⚠ This action is irreversible.</div>
          <textarea value={bulkDelete} onChange={e=>setBulkDelete(e.target.value)} placeholder="Order IDs (one per line)" className="w-full bg-[#1c1112] border border-[#2d1515] rounded p-2 text-sm text-white h-16 mb-3 focus:outline-none focus:border-red-600" />
          <label className="flex items-center gap-2 mb-4 text-xs text-white cursor-pointer">
            <input type="checkbox" checked={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.checked)} />
            I understand this action cannot be undone
          </label>
          <Button className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-900" onClick={() => handleOp('delete', '/orders/bulk/delete', 'delete', { orderIDs: parseIds(bulkDelete) })} disabled={!deleteConfirm} loading={loadingObj.delete}>Delete Orders</Button>
        </div>

        {/* Cleanup Cancelled */}
        <div className="bg-[#111]/60 border border-[#2d1515] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400"><Eraser className="w-5 h-5"/></div>
            <div>
              <h3 className="font-card-title text-white">Cleanup Cancelled</h3>
              <p className="text-xs text-red-300/50">Remove old cancelled orders</p>
            </div>
          </div>
          <p className="text-sm text-red-200 mb-2">Delete cancelled orders before:</p>
          <input type="date" value={cleanupDate} onChange={e=>setCleanupDate(e.target.value)} className="w-full bg-[#1c1112] border border-[#2d1515] rounded p-2 text-sm text-white mb-4 focus:outline-none focus:border-red-600" />
          <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-[68px]" onClick={() => handleOp('cleanup', '/orders/bulk/cleanup-cancelled', 'delete', null, { before: cleanupDate })} loading={loadingObj.cleanup} disabled={!cleanupDate}>Run Cleanup</Button>
        </div>

      </div>
    </div>
  );
}
