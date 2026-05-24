import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchAnalyticsOverview = createAsyncThunk(
  'analytics/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const [revenue, orders, customers, products] = await Promise.all([
        axios.get('/analytics/revenue/total'),
        axios.get('/analytics/orders/count'),
        axios.get('/analytics/customers/top'),
        axios.get('/analytics/products/top-selling'),
      ]);
      return {
        revenue:   revenue.data.data,
        orders:    orders.data.data,
        customers: customers.data.data,
        products:  products.data.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  'analytics/fetchMonthly',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/analytics/revenue/monthly');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    overview:       null,
    monthlyRevenue: [],
    loading:        false,
    error:          null,
    lastFetched:    null,
  },
  reducers: {
    clearAnalytics: (state) => {
      state.overview       = null;
      state.monthlyRevenue = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsOverview.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
        state.loading     = false;
        state.overview    = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAnalyticsOverview.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.monthlyRevenue = action.payload;
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;

export const selectAnalyticsOverview  = (state) => state.analytics.overview;
export const selectMonthlyRevenue     = (state) => state.analytics.monthlyRevenue;
export const selectAnalyticsLoading   = (state) => state.analytics.loading;
