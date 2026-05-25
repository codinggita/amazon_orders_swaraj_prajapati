import React, { useState, useEffect, useCallback } from 'react';
import { shippingAPI } from '../../api/shipping.api';
import { ordersAPI } from '../../api/orders.api';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import GlassContent from '../../components/common/GlassContent';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import OrderStatusBadge from '../../components/features/orders/OrderStatusBadge';
import { formatDate } from '../../utils/formatters';
import { Truck, Package, Check, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'returned', label: 'Returned' },
];

const getCarrier = (method) =>
  ({
    UPI: 'BlueDart',
    'Debit Card': 'FedEx',
    'Credit Card': 'DHL',
    'Net Banking': 'DTDC',
    COD: 'India Post',
    Wallet: 'Delhivery',
  })[method] || 'ShipRocket';

/** Normalize list + total from orders vs shipping API shapes with extreme safety */
function parseListResponse(res) {
  if (!res) return { list: [], total: 0 };
  const body = res.data ?? res ?? {};
  
  let list = [];
  if (Array.isArray(body)) {
    list = body;
  } else if (body && typeof body === 'object') {
    list = body.data ?? body.orders ?? body.list ?? [];
  }
  
  if (!Array.isArray(list)) list = [];
  const total = body.total ?? list.length ?? 0;
  return { list, total };
}

export default function ShippingPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [trackingModal, setTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [stats, setStats] = useState({ pending: 0, delivered: 0, returned: 0, total: 0 });

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      const params = { page, limit, sort: '-date' };
      console.log('ShippingPage: Fetching shipments with activeTab =', activeTab, 'params =', params);

      switch (activeTab) {
        case 'pending':
          res = await shippingAPI.getPending(params);
          break;
        case 'delivered':
          res = await shippingAPI.getDelivered(params);
          break;
        case 'returned':
          res = await shippingAPI.getReturned(params);
          break;
        default:
          res = await ordersAPI.getAll(params);
      }

      console.log('ShippingPage: Received response =', res);
      const { list, total: totalCount } = parseListResponse(res);
      console.log('ShippingPage: Parsed shipments count =', list.length, 'total count =', totalCount);
      
      setShipments(list);
      setTotal(totalCount);
    } catch (err) {
      console.error('ShippingPage: Shipments fetch error:', err);
      toast.error(err.response?.data?.message || 'Failed to load shipments');
      setShipments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('ShippingPage: Fetching stats on mount...');
        const [pendingRes, deliveredRes, returnedRes, allRes] = await Promise.all([
          shippingAPI.getPending({ page: 1, limit: 1 }),
          shippingAPI.getDelivered({ page: 1, limit: 1 }),
          shippingAPI.getReturned({ page: 1, limit: 1 }),
          ordersAPI.getAll({ page: 1, limit: 1 }),
        ]);
        
        const pending = parseListResponse(pendingRes).total;
        const delivered = parseListResponse(deliveredRes).total;
        const returned = parseListResponse(returnedRes).total;
        const total = parseListResponse(allRes).total;
        
        console.log('ShippingPage: Mount stats successfully loaded:', { pending, delivered, returned, total });
        
        setStats({ pending, delivered, returned, total });
      } catch (err) {
        console.error('ShippingPage: Mount stats load error:', err);
      }
    };
    fetchStats();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handleTrack = async (order) => {
    setSelectedOrder(order);
    setTrackingModal(true);
    setTrackingData(null);
    const orderId = order.OrderID || order._id;
    try {
      const res = await shippingAPI.track(orderId);
      setTrackingData(res.data?.data || null);
    } catch {
      setTrackingData({
        carrier: getCarrier(order.PaymentMethod),
        currentStatus: order.OrderStatus || 'Pending',
        estimatedDelivery: formatDate(
          new Date(new Date(order.OrderDate).getTime() + 7 * 24 * 60 * 60 * 1000)
        ),
        shippingAddress: { city: order.City, state: order.State, country: order.Country },
      });
    }
  };

  const steps = ['Label Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const getStepIndex = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s.includes('deliver') && !s.includes('out')) return 4;
    if (s.includes('out')) return 3;
    if (s.includes('ship') || s.includes('transit')) return 2;
    if (s.includes('pick')) return 1;
    return 0;
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.OrderStatus) : 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <SEO
        title="Shipping & Tracking"
        description="Track and manage all shipments. View pending, shipped, delivered, and returned orders with real-time carrier tracking information."
        url="/shipping"
        keywords="shipping tracking, order shipment, carrier tracking, delivery status"
      />
      <div>
        <PageHeader label="LOGISTICS" title="Shipments" subtitle="Track and manage all shipments" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-red-400', bg: 'bg-red-900/30' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-400', bg: 'bg-amber-900/30' },
            { label: 'Delivered', value: stats.delivered, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
            { label: 'Returned', value: stats.returned, color: 'text-red-400', bg: 'bg-red-900/30' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-panel border-[#4b2020]/50 rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="kpi-label text-[9px] mb-1">{stat.label}</p>
                <p className="font-metric text-xl text-white tabular-nums">{(stat.value ?? 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 border-b border-[#2d1515] pb-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`font-badge text-[11px] tracking-[0.06em] px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white border border-red-500 shadow-md shadow-red-900/30'
                  : 'text-red-400/80 hover:text-red-300 bg-[#1c1112] border border-[#2d1515] hover:border-red-800/50'
              }`}
            >
              {tab.label}
              {tab.id === 'all' && stats.total > 0 && activeTab !== 'all' && (
                <span className="ml-1 opacity-60">({(stats.total ?? 0).toLocaleString('en-IN')})</span>
              )}
            </button>
          ))}
        </div>

        <GlassContent loading={loading} minHeight="280px" empty={!loading && shipments.length === 0}>
        <Card padding="p-0" className="glass-panel border-[#4b2020]/50">
          <div className="overflow-x-auto min-h-[200px] glass-reveal-in">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#2d1515]">
                <tr>
                  {['Order ID', 'Customer', 'Product', 'Carrier', 'Status', 'Est. Delivery', 'Actions'].map((h) => (
                    <th key={h} className="font-table-header text-[9px] tracking-[0.15em] text-red-400/50 px-4 py-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d1515]">
                {shipments.filter(Boolean).length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon={Truck}
                        title="No shipments found"
                        description={
                          activeTab === 'all'
                            ? 'No orders in the system yet.'
                            : `No ${activeTab} shipments match this filter.`
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  shipments.filter(Boolean).map((order) => {
                    const estDate = order.OrderDate
                      ? new Date(new Date(order.OrderDate).getTime() + 7 * 24 * 60 * 60 * 1000)
                      : null;
                    return (
                      <tr
                        key={order._id || order.OrderID}
                        className="hover:bg-red-950/10 transition-colors"
                      >
                        <td className="px-4 py-3 font-order-id text-red-400">
                          {order.OrderID || order._id}
                        </td>
                        <td className="px-4 py-3 font-body text-[13px] text-white">{order.CustomerName}</td>
                        <td className="px-4 py-3 font-body text-[13px] text-red-200/80 truncate max-w-[150px]">
                          {order.ProductName}
                        </td>
                        <td className="px-4 py-3 font-body text-[13px] text-white">
                          {getCarrier(order.PaymentMethod)}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.OrderStatus} />
                        </td>
                        <td className="px-4 py-3 font-timestamp text-[12px] opacity-100 text-red-300/60">
                          {estDate ? formatDate(estDate) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleTrack(order)}
                            className="p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                            title="Track shipment"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
        </GlassContent>

        {!loading && total > 0 && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
            />
          </div>
        )}

        <Modal
          show={trackingModal}
          onClose={() => setTrackingModal(false)}
          title={`Track #${selectedOrder?.OrderID || selectedOrder?._id}`}
          size="lg"
        >
          {trackingData ? (
            <div className="p-4">
              <div className="flex items-center w-full my-8 relative">
                <div className="absolute top-4 left-0 w-full h-1 bg-[#2d1515] -z-10" />
                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-[#2d1515] text-red-400/40 border border-[#4b2020]'
                        }`}
                      >
                        {isCompleted && <Check className="w-4 h-4" />}
                      </div>
                      <p className="font-label text-[9px] mt-2 text-center opacity-80">{step}</p>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 bg-[#111]/40 border border-[#2d1515] p-4 rounded-xl">
                <div>
                  <p className="kpi-label text-[9px] mb-1">Carrier</p>
                  <p className="font-body text-[13px] text-white">{trackingData.carrier}</p>
                </div>
                <div>
                  <p className="kpi-label text-[9px] mb-1">Tracking ID</p>
                  <p className="font-order-id text-red-400">TRK-{selectedOrder?.OrderID || selectedOrder?._id}</p>
                </div>
                <div>
                  <p className="kpi-label text-[9px] mb-1">Status</p>
                  <p className="font-body text-[13px] text-white">{trackingData.currentStatus}</p>
                </div>
                <div>
                  <p className="kpi-label text-[9px] mb-1">Estimated</p>
                  <p className="font-body text-[13px] text-white">{trackingData.estimatedDelivery}</p>
                </div>
                <div className="col-span-2">
                  <p className="kpi-label text-[9px] mb-1">Address</p>
                  <p className="font-body-sm text-red-200/80">
                    {trackingData.shippingAddress?.city}, {trackingData.shippingAddress?.state},{' '}
                    {trackingData.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Spinner center />
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
