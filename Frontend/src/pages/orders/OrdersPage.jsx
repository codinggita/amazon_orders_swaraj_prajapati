import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import OrderFilters from '../../components/features/orders/OrderFilters';
import OrderTable from '../../components/features/orders/OrderTable';
import CreateOrderModal from '../../components/features/orders/CreateOrderModal';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { Search, Plus, Filter, Download } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { ordersAPI } from '../../api/orders.api';
import useDebounce from '../../hooks/useDebounce';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', payment: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, loading, refetch } = useFetch(
    () => ordersAPI.getAll({ page, limit, sort: '-OrderDate', q: debouncedSearch, ...filters }),
    [page, limit, debouncedSearch, filters]
  );

  const orders = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        label="ORDER MANAGEMENT"
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
            <Button variant="secondary" icon={Download} onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href",     dataStr);
              downloadAnchorNode.setAttribute("download", "orders_export.json");
              document.body.appendChild(downloadAnchorNode); 
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}>Export</Button>
            <Button icon={Plus} onClick={() => setShowCreateModal(true)}>New Order</Button>
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

      <OrderTable 
        orders={orders} 
        loading={loading}
        selectedRows={new Set()}
        onSelectRow={() => {}}
        onSelectAll={() => {}}
      />

      <div className="mt-6">
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
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSuccess={refetch} 
      />
    </div>
  );
}
