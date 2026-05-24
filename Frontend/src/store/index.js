import { configureStore } from '@reduxjs/toolkit';
import authReducer         from './slices/authSlice';
import ordersReducer       from './slices/ordersSlice';
import uiReducer           from './slices/uiSlice';
import analyticsReducer    from './slices/analyticsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    orders:        ordersReducer,
    ui:            uiReducer,
    analytics:     analyticsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
