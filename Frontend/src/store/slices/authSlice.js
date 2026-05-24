import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { data } = res.data;
      localStorage.setItem('orderpulse_token', data.accessToken);
      localStorage.setItem('orderpulse_user',  JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/register', formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/auth/profile');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.patch('/auth/profile', data);
      const updated = res.data.data;
      localStorage.setItem('orderpulse_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('orderpulse_token');
    localStorage.removeItem('orderpulse_user');
    localStorage.removeItem('orderpulse_avatar');
    localStorage.removeItem('orderpulse_avatar_url');
  }
);

// Load initial state from localStorage
const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('orderpulse_user') || 'null');
  } catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        storedUser,
    token:       localStorage.getItem('orderpulse_token') || null,
    isLoggedIn:  !!localStorage.getItem('orderpulse_token'),
    isAdmin:     storedUser?.role === 'admin',
    loading:     false,
    error:       null,
    profileLoading: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser:    (state, action) => {
      state.user       = action.payload;
      state.isLoggedIn = !!action.payload;
      state.isAdmin    = action.payload?.role === 'admin';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading   = false;
        state.user      = action.payload.user;
        state.token     = action.payload.accessToken;
        state.isLoggedIn = true;
        state.isAdmin   = action.payload.user?.role === 'admin';
      })
      .addCase(loginUser.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Register
      .addCase(registerUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Fetch profile
      .addCase(fetchProfile.pending,   (state) => { state.profileLoading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user           = action.payload;
        state.isAdmin        = action.payload?.role === 'admin';
      })
      .addCase(fetchProfile.rejected,  (state) => { state.profileLoading = false; })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user      = null;
        state.token     = null;
        state.isLoggedIn = false;
        state.isAdmin   = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser      = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsAdmin   = (state) => state.auth.isAdmin;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
