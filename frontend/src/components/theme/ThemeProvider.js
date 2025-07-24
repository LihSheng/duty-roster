import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeTheme, toggleTheme as toggleThemeUtil } from '../../utils/theme';

// Create context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Initialize theme on component mount
  useEffect(() => {
    const initialTheme = initializeTheme();
    setTheme(initialTheme);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
