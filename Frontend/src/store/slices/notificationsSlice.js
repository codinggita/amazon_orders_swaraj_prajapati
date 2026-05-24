import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get('/notifications', { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await axios.patch(`/notifications/read/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/notifications/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list:        [],
    unreadCount: 0,
    loading:     false,
    error:       null,
  },
  reducers: {
    markAllReadLocal: (state) => {
      state.list       = state.list.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending,   (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading     = false;
        state.list        = action.payload?.notifications || [];
        state.unreadCount = action.payload?.unreadCount   || 0;
      })
      .addCase(fetchNotifications.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const n = state.list.find(n => n.id === action.payload);
        if (n && !n.isRead) {
          n.isRead      = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const n = state.list.find(n => n.id === action.payload);
        if (n && !n.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.list = state.list.filter(n => n.id !== action.payload);
      });
  },
});

export const { markAllReadLocal } = notificationsSlice.actions;
export default notificationsSlice.reducer;

export const selectNotifications  = (state) => state.notifications.list;
export const selectUnreadCount    = (state) => state.notifications.unreadCount;
export const selectNotifLoading   = (state) => state.notifications.loading;
