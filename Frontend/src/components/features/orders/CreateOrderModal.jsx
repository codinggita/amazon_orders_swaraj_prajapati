import React from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Select from '../../common/Select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, updateOrder } from '../../../store/slices/ordersSlice';
import toast from 'react-hot-toast';

const orderSchema = Yup.object({
  OrderID:       Yup.string().min(3).max(50).required('Order ID is required'),
  OrderDate:     Yup.string().required('Order Date is required'),
  CustomerID:    Yup.string().required('Customer ID is required'),
  CustomerName:  Yup.string().min(2).max(100).required('Customer name is required'),
  ProductID:     Yup.string().required('Product ID is required'),
  ProductName:   Yup.string().min(2).max(200).required('Product name is required'),
  Category:      Yup.string().required('Category is required'),
  Brand:         Yup.string().required('Brand is required'),
  Quantity:      Yup.number().min(1, 'Minimum 1').required('Quantity is required'),
  UnitPrice:     Yup.number().min(0).required('Unit Price is required'),
  TotalAmount:   Yup.number().min(0).required('Total Amount is required'),
  PaymentMethod: Yup.string().oneOf(['UPI','Debit Card','Credit Card','Net Banking','COD','Wallet']).required(),
  OrderStatus:   Yup.string().oneOf(['Pending','Shipped','Delivered','Cancelled']).required(),
  City:          Yup.string().required('City is required'),
  State:         Yup.string().required('State is required'),
  Country:       Yup.string().required('Country is required'),
  SellerID:      Yup.string().required('Seller ID is required'),
});

export default function CreateOrderModal({ show, onClose, onSuccess, initialData }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      OrderID:       initialData?.OrderID || `ORD-${Date.now()}`,
      OrderDate:     initialData?.OrderDate ? new Date(initialData.OrderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      CustomerID:    initialData?.CustomerID || '',
      CustomerName:  initialData?.CustomerName || '',
      ProductID:     initialData?.ProductID || '',
      ProductName:   initialData?.ProductName || '',
      Category:      initialData?.Category || '',
      Brand:         initialData?.Brand || '',
      Quantity:      initialData?.Quantity || 1,
      UnitPrice:     initialData?.UnitPrice || 0,
      TotalAmount:   initialData?.TotalAmount || 0,
      PaymentMethod: initialData?.PaymentMethod || 'UPI',
      OrderStatus:   initialData?.OrderStatus || 'Pending',
      City:          initialData?.City || '',
      State:         initialData?.State || '',
      Country:       initialData?.Country || '',
      SellerID:      initialData?.SellerID || 'SEL-001',
    },
    validationSchema: orderSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (initialData && (initialData.OrderID || initialData._id)) {
          const result = await dispatch(updateOrder({ orderId: initialData.OrderID || initialData._id, data: values }));
          if (updateOrder.fulfilled.match(result)) {
            toast.success('Order updated successfully!');
            onSuccess?.();
            onClose();
          } else throw new Error(result.payload);
        } else {
          const result = await dispatch(createOrder(values));
          if (createOrder.fulfilled.match(result)) {
            toast.success('Order created successfully!');
            onSuccess?.();
            onClose();
          } else throw new Error(result.payload);
        }
      } catch (err) {
        toast.error(err.message || 'Action failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const InputField = ({ name, label, type = "text" }) => (
    <div>
      <label className="block text-xs text-red-300/70 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full bg-[#111] border rounded-lg h-10 px-3 text-white focus:outline-none transition-colors ${
          formik.touched[name] && formik.errors[name] ? 'border-red-500 focus:border-red-500' : 'border-[#2d1515] focus:border-red-600'
        }`}
      />
      {formik.touched[name] && formik.errors[name] && <p className="text-[10px] text-red-500 mt-1">{formik.errors[name]}</p>}
    </div>
  );

  return (
    <Modal show={show} onClose={onClose} title={initialData ? "Edit Order" : "Create New Order"}>
      <form onSubmit={formik.handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 gap-4">
          <InputField name="OrderID" label="Order ID" />
          <InputField name="OrderDate" label="Order Date" type="date" />
          
          <InputField name="CustomerID" label="Customer ID" />
          <InputField name="CustomerName" label="Customer Name" />
          
          <InputField name="ProductID" label="Product ID" />
          <InputField name="ProductName" label="Product Name" />
          
          <InputField name="Category" label="Category" />
          <InputField name="Brand" label="Brand" />
          
          <InputField name="Quantity" label="Quantity" type="number" />
          <InputField name="UnitPrice" label="Unit Price" type="number" />
          
          <InputField name="TotalAmount" label="Total Amount" type="number" />
          
          <div>
            <label className="block text-xs text-red-300/70 mb-1">Payment Method</label>
            <Select 
              name="PaymentMethod" 
              value={formik.values.PaymentMethod} 
              onChange={(e) => formik.setFieldValue('PaymentMethod', e.target.value)} 
              options={['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'COD', 'Wallet']}
            />
          </div>
          
          <div>
            <label className="block text-xs text-red-300/70 mb-1">Order Status</label>
            <Select 
              name="OrderStatus" 
              value={formik.values.OrderStatus} 
              onChange={(e) => formik.setFieldValue('OrderStatus', e.target.value)} 
              options={['Pending','Shipped','Delivered','Cancelled']}
            />
          </div>
          
          <InputField name="SellerID" label="Seller ID" />
          
          <InputField name="City" label="City" />
          <InputField name="State" label="State" />
          
          <InputField name="Country" label="Country" />
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2d1515] sticky bottom-0 bg-[var(--bg-surface)]">
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={loading} disabled={loading || !formik.isValid}>
            {initialData ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
