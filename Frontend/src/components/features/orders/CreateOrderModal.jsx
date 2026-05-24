import React, { useState } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { ordersAPI } from '../../../api/orders.api';
import toast from 'react-hot-toast';

export default function CreateOrderModal({ show, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    CustomerName: '',
    ProductName: '',
    Quantity: 1,
    TotalAmount: 0,
    Category: '',
    Brand: '',
    City: '',
    PaymentMethod: 'UPI'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ordersAPI.create({
        ...formData,
        OrderID: `ORD-${Date.now()}`,
        OrderDate: new Date().toISOString(),
        OrderStatus: 'Pending'
      });
      toast.success('Order created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} title="Create New Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-red-300/70 mb-1">Customer Name</label>
          <input required name="CustomerName" value={formData.CustomerName} onChange={handleChange} className="w-full bg-[#111] border border-[#2d1515] rounded-lg h-10 px-3 text-white focus:border-red-600 outline-none" />
        </div>
        <div>
          <label className="block text-xs text-red-300/70 mb-1">Product Name</label>
          <input required name="ProductName" value={formData.ProductName} onChange={handleChange} className="w-full bg-[#111] border border-[#2d1515] rounded-lg h-10 px-3 text-white focus:border-red-600 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-red-300/70 mb-1">Quantity</label>
            <input required type="number" min="1" name="Quantity" value={formData.Quantity} onChange={handleChange} className="w-full bg-[#111] border border-[#2d1515] rounded-lg h-10 px-3 text-white focus:border-red-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-red-300/70 mb-1">Total Amount</label>
            <input required type="number" name="TotalAmount" value={formData.TotalAmount} onChange={handleChange} className="w-full bg-[#111] border border-[#2d1515] rounded-lg h-10 px-3 text-white focus:border-red-600 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-red-300/70 mb-1">Category</label>
            <input required name="Category" value={formData.Category} onChange={handleChange} className="w-full bg-[#111] border border-[#2d1515] rounded-lg h-10 px-3 text-white focus:border-red-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-red-300/70 mb-1">Payment Method</label>
            <select required name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} className="w-full bg-[#111] border border-[#2d1515] rounded-lg h-10 px-3 text-white focus:border-red-600 outline-none">
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="COD">COD</option>
              <option value="Wallet">Wallet</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={loading}>Create Order</Button>
        </div>
      </form>
    </Modal>
  );
}
