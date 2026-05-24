import { createTheme } from '@mui/material/styles';

export const createMuiTheme = (isDark) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main:  '#dc2626',
      dark:  '#b91c1c',
      light: '#ef4444',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: isDark ? '#0a0a0a' : '#fafafa',
      paper:   isDark ? '#1c1112' : '#ffffff',
    },
    text: {
      primary:   isDark ? '#fef2f2' : '#111827',
      secondary: isDark ? '#fca5a5' : '#6b7280',
    },
    divider: isDark ? '#4b2020' : '#e5e7eb',
    error:   { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#22c55e' },
    info:    { main: '#3b82f6' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Clash Display", "Inter", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Clash Display", "Inter", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Clash Display", "Inter", sans-serif', fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.55 },
    caption: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.75rem',
    },
    button: { fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#dc2626',
          '&:hover': { backgroundColor: '#b91c1c' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: isDark ? '#4b2020' : '#e5e7eb',
            },
            '&:hover fieldset': {
              borderColor: '#dc2626',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#dc2626',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: isDark ? '#1c1112' : '#ffffff',
          border: `1px solid ${isDark ? '#4b2020' : '#e5e7eb'}`,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${isDark ? '#4b2020' : '#e5e7eb'}`,
          borderRadius: 12,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDark ? '#2d1515' : '#f9fafb',
            borderBottom: `1px solid ${isDark ? '#4b2020' : '#e5e7eb'}`,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: isDark ? 'rgba(220,38,38,0.05)' : 'rgba(220,38,38,0.02)',
          },
          '& .MuiDataGrid-cell': {
            borderColor: isDark ? '#2d1515' : '#f3f4f6',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontSize: '0.75rem' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? '#2d1515' : '#1f2937',
          color: isDark ? '#fef2f2' : '#f9fafb',
          border: `1px solid ${isDark ? '#4b2020' : '#374151'}`,
          borderRadius: 8,
          fontSize: '0.75rem',
          fontFamily: '"Inter", sans-serif',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? '#1c1112' : '#ffffff',
          border: `1px solid ${isDark ? '#4b2020' : '#e5e7eb'}`,
          borderRadius: 16,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#dc2626',
            '& + .MuiSwitch-track': {
              backgroundColor: '#dc2626',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
        bar:  { backgroundColor: '#dc2626' },
      },
    },
  },
});
