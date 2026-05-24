import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import OrderStatusBadge from '../../components/features/orders/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ordersAPI } from '../../api/orders.api';
import { ArrowLeft, Edit2, Archive, XCircle, Trash2, MapPin, User, CreditCard } from 'lucide-react';

import toast from 'react-hot-toast';
import CreateOrderModal from '../../components/features/orders/CreateOrderModal';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getById(orderId);
      setOrder(res.data?.data || res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleArchive = async () => {
    try {
      await ordersAPI.archive(order.OrderID || order._id);
      toast.success('Order archived');
      fetchOrder();
    } catch { toast.error('Failed to archive order'); }
  };

  const handleCancel = async () => {
    if(!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersAPI.cancel(order.OrderID || order._id);
      toast.success('Order cancelled');
      fetchOrder();
    } catch { toast.error('Failed to cancel order'); }
  };

  if (loading) return <Spinner center />;
  if (error || !order) return <ErrorState error={error || "Order not found"} onRetry={() => window.location.reload()} />;

  const amount = parseFloat(order.TotalAmount || order.Amount) || 0;
  const discount = parseFloat(order.Discount) || 0;
  const subtotal = amount + discount;

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
      </div>

      <PageHeader 
        title={`Order #${order.OrderID || order._id}`}
        actions={
          <>
            <Button variant="secondary" icon={Edit2} onClick={() => setIsEditModalOpen(true)}>Edit</Button>
            <Button variant="outline" icon={Archive} onClick={handleArchive}>Archive</Button>
            <Button variant="danger" icon={XCircle} onClick={handleCancel}>Cancel</Button>
          </>
        }
      />
      
      <CreateOrderModal 
        show={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={() => { setIsEditModalOpen(false); fetchOrder(); }} 
        initialData={order}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Order Items" padding="p-0">
            <div className="p-4 border-b border-[#2d1515] flex gap-4">
              <div className="w-16 h-16 bg-red-950/30 rounded flex items-center justify-center shrink-0">
                <span className="text-red-500 font-bold text-xs">{order.Category?.substring(0,3)?.toUpperCase() || 'ITM'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{order.ProductName}</p>
                <div className="text-xs text-red-300/60 mt-1 space-y-0.5">
                  <p>Product ID: {order.ProductID}</p>
                  <p>Category: {order.Category}</p>
                  <p>Brand: {order.Brand}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium text-white">{formatCurrency(amount)}</p>
                <p className="text-xs text-red-300/60 mt-1">Qty: {order.Quantity || 1}</p>
              </div>
            </div>
          </Card>

          <Card title="Price Breakdown">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-red-200">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-400">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between text-red-200">
                <span>Shipping</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between text-red-200">
                <span>Tax</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="pt-3 border-t border-[#2d1515] flex justify-between font-bold text-white text-lg">
                <span>Total</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Customer Information">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-700 rounded-full flex items-center justify-center text-white font-bold">
                {order.CustomerName?.[0] || 'C'}
              </div>
              <div>
                <p className="font-medium text-white">{order.CustomerName}</p>
                <p className="text-xs text-red-300/60">ID: {order.CustomerID}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-red-200/80">
              <p className="flex gap-2"><MapPin className="w-4 h-4 text-red-400" /> {order.City}, {order.State}, {order.Country}</p>
            </div>
          </Card>

          <Card title="Order Details">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-red-300/50 mb-1">Status</p>
                <OrderStatusBadge status={order.OrderStatus || 'Pending'} />
              </div>
              <div>
                <p className="text-xs text-red-300/50 mb-1">Payment Method</p>
                <p className="text-sm text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-red-400" /> {order.PaymentMethod || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-red-300/50 mb-1">Order Date</p>
                <p className="text-sm text-white">{formatDate(order.OrderDate)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
