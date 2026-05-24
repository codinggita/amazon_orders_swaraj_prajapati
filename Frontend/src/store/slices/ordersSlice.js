import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get('/orders', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/orders/${orderId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Order not found');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/orders', orderData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/update',
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/orders/${orderId}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`/orders/${orderId}`);
      return orderId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete order');
    }
  }
);

export const searchOrders = createAsyncThunk(
  'orders/search',
  async ({ query, params }, { rejectWithValue }) => {
    try {
      const res = await axios.get('/orders/search', { params: { q: query, ...params } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list:         [],
    currentOrder: null,
    loading:      false,
    searchLoading: false,
    error:        null,
    total:        0,
    page:         1,
    limit:        10,
    totalPages:   0,
    filters: {
      status:  '',
      payment: '',
      search:  '',
      sort:    '-date',
    },
    selectedIds: [],
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page    = 1; // Reset page on filter change
    },
    setPage:        (state, action) => { state.page  = action.payload; },
    setLimit:       (state, action) => { state.limit = action.payload; state.page = 1; },
    setSelectedIds: (state, action) => { state.selectedIds = action.payload; },
    clearCurrentOrder: (state) => { state.currentOrder = null; },
    clearError:     (state) => { state.error = null; },
    // Store filters in sessionStorage for temporary state
    saveFiltersToSession: (state) => {
      sessionStorage.setItem('orderpulse_order_filters', JSON.stringify(state.filters));
    },
    loadFiltersFromSession: (state) => {
      const saved = sessionStorage.getItem('orderpulse_order_filters');
      if (saved) {
        try { state.filters = JSON.parse(saved); } catch (_) {}
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload.data || [];
        state.total      = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.page       = action.payload.page || 1;
      })
      .addCase(fetchOrders.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(fetchOrderById.pending,   (state) => { state.loading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading      = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const idx = state.list.findIndex(o => o.OrderID === action.payload.OrderID);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.currentOrder?.OrderID === action.payload.OrderID) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.list  = state.list.filter(o => o.OrderID !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(searchOrders.pending,   (state) => { state.searchLoading = true; })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.list          = action.payload.data || [];
        state.total         = action.payload.total || 0;
        state.totalPages    = action.payload.totalPages || 0;
      })
      .addCase(searchOrders.rejected,  (state) => { state.searchLoading = false; });
  },
});

export const {
  setFilters, setPage, setLimit, setSelectedIds,
  clearCurrentOrder, clearError,
  saveFiltersToSession, loadFiltersFromSession,
} = ordersSlice.actions;

export default ordersSlice.reducer;

export const selectOrders     = (state) => state.orders.list;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersTotal   = (state) => state.orders.total;
export const selectCurrentOrder  = (state) => state.orders.currentOrder;
export const selectOrderFilters  = (state) => state.orders.filters;
