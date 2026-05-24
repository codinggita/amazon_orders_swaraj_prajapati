import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Force dark theme class
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // Force CSS variables for dark red crimson theme
    const root = document.documentElement;
    root.style.setProperty('--bg-primary',    '#0a0a0a');
    root.style.setProperty('--bg-surface',    '#1c1112');
    root.style.setProperty('--bg-surface2',   '#2d1515');
    root.style.setProperty('--border-color',  '#4b2020');
    root.style.setProperty('--text-primary',  '#fef2f2');
    root.style.setProperty('--text-muted',    '#fca5a5');
    root.style.setProperty('--text-dim',      '#f87171');
    root.style.setProperty('--brand-primary', '#dc2626');
    root.style.setProperty('--brand-hover',   '#b91c1c');
    root.style.setProperty('--input-bg',      '#0d0d0d');
    root.style.setProperty('--card-shadow',   'rgba(220,38,38,0.1)');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark: true, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
