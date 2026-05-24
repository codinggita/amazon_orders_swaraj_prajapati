import React, { useState, useCallback } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import OrderFilters from '../../components/features/orders/OrderFilters';
import OrderTable from '../../components/features/orders/OrderTable';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { Search, Plus, Filter, Download } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { ordersAPI } from '../../api/orders.api';
import useDebounce from '../../hooks/useDebounce';
import GlassContent from '../../components/common/GlassContent';
import { parseOrdersList } from '../../utils/apiHelpers';
import CreateOrderModal from '../../components/features/orders/CreateOrderModal';

export default function OrdersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', payment: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const fetchOrders = useCallback(() => {
    const params = { page, limit, sort: '-OrderDate' };
    if (filters.status) {
      return ordersAPI.filterByStatus(filters.status, params);
    }
    if (filters.payment) {
      return ordersAPI.filterByPayment(filters.payment, params);
    }
    return ordersAPI.getAll({ ...params, q: debouncedSearch || undefined });
  }, [page, limit, debouncedSearch, filters.status, filters.payment]);

  const { data, loading, refetch } = useFetch(fetchOrders, [
    page,
    limit,
    debouncedSearch,
    filters.status,
    filters.payment,
  ]);

  const { orders, total } = data ? parseOrdersList({ data }) : { orders: [], total: 0 };
  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div>
      <PageHeader 
        title="All Orders" 
        actions={
          <>
            <div className="relative mr-2 hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400/50" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1c1112] border border-[#2d1515] rounded-lg h-9 pl-9 pr-4 text-sm text-white placeholder:text-red-300/40 focus:outline-none focus:border-red-600 w-48"
              />
            </div>
            <Button variant="secondary" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
              Filters
            </Button>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>New Order</Button>
          </>
        } 
      />

      {showFilters && (
        <OrderFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={() => { setFilters({ status: '', payment: '' }); setPage(1); }} 
        />
      )}

      <GlassContent loading={loading} minHeight="280px" empty={!loading && orders.length === 0}>
        <OrderTable
          orders={orders}
          loading={false}
          selectedRows={new Set()}
          onSelectRow={() => {}}
          onSelectAll={() => {}}
        />
      </GlassContent>

      <div className="mt-6 glass-reveal-in">
        <Pagination 
          page={page} 
          totalPages={totalPages} 
          total={total} 
          limit={limit} 
          onPageChange={setPage} 
          onLimitChange={(l) => { setLimit(l); setPage(1); }} 
        />
      </div>

      <CreateOrderModal 
        show={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => { setIsCreateModalOpen(false); refetch(); }} 
      />
    </div>
  );
}
