import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // App is strictly dark theme as per design
  const [theme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark: true }}>
      <div className="dark text-white min-h-screen bg-[#0a0a0a]">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
