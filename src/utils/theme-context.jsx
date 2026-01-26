import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then default to 't3-dark'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devfinder-theme');
      const initialTheme = saved || 't3-dark';
      // Apply immediately to prevent flash
      document.documentElement.setAttribute('data-theme', initialTheme);
      return initialTheme;
    }
    return 't3-dark';
  });

  useEffect(() => {
    // Apply theme to document and persist
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('devfinder-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 't3-dark' ? 't3-light' : 't3-dark'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
