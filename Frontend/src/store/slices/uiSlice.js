import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen:    true,
    isLoading:      false,
    globalError:    null,
    alerts:         [],
    activeModal:    null,
    breadcrumbs:    [],
  },
  reducers: {
    toggleSidebar:     (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen:    (state, action) => { state.sidebarOpen = action.payload; },
    setGlobalLoading:  (state, action) => { state.isLoading = action.payload; },
    setGlobalError:    (state, action) => { state.globalError = action.payload; },
    clearGlobalError:  (state) => { state.globalError = null; },
    addAlert: (state, action) => {
      state.alerts.push({
        id:      Date.now().toString(),
        type:    'info',
        ...action.payload,
      });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    setActiveModal:    (state, action) => { state.activeModal = action.payload; },
    closeModal:        (state) => { state.activeModal = null; },
    setBreadcrumbs:    (state, action) => { state.breadcrumbs = action.payload; },
  },
});

export const {
  toggleSidebar, setSidebarOpen,
  setGlobalLoading, setGlobalError, clearGlobalError,
  addAlert, removeAlert,
  setActiveModal, closeModal,
  setBreadcrumbs,
} = uiSlice.actions;

export default uiSlice.reducer;

export const selectSidebarOpen  = (state) => state.ui.sidebarOpen;
export const selectGlobalLoading = (state) => state.ui.isLoading;
export const selectGlobalError  = (state) => state.ui.globalError;
export const selectAlerts       = (state) => state.ui.alerts;
